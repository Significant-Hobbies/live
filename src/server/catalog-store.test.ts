import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { catalogSeedSql, parseCatalogQuery, searchCatalogSeed } from '~/lib/catalog-seed';
import { EXPERIENCE_ENTRIES } from '~/lib/experiences';
import {
  reviewStoredCatalogIdea,
  searchStoredCatalog,
  submitStoredCatalogIdea,
  type CatalogDatabase,
  type CatalogStatement,
} from './catalog-store';

let sqlite: DatabaseSync;
let database: CatalogDatabase;
class Statement implements CatalogStatement {
  private values: Array<string | number> = [];
  private readonly sql: string;
  constructor(sql: string) {
    this.sql = sql;
  }
  bind(...values: Array<string | number>) {
    this.values = values;
    return this;
  }
  async first<T>(column?: string) {
    const row = sqlite.prepare(this.sql).get(...this.values);
    return (row ? (column ? row[column] : row) : null) as T | null;
  }
  async all<T>() {
    return { results: sqlite.prepare(this.sql).all(...this.values) as T[] };
  }
  async run() {
    return sqlite.prepare(this.sql).run(...this.values);
  }
}
beforeEach(() => {
  sqlite = new DatabaseSync(':memory:');
  sqlite.exec(
    "PRAGMA foreign_keys = ON; CREATE TABLE User (id TEXT PRIMARY KEY); INSERT INTO User VALUES ('alice'),('bob'); CREATE TABLE BucketListItem (title TEXT); INSERT INTO BucketListItem VALUES ('A private personal dream');"
  );
  sqlite.exec(readFileSync(resolve('migrations/d1/0007_wandering_bloodscream.sql'), 'utf8'));
  database = {
    prepare: (sql) => new Statement(sql),
    async batch(statements) {
      sqlite.exec('BEGIN');
      try {
        const result = await Promise.all(statements.map((statement) => statement.run()));
        sqlite.exec('COMMIT');
        return result;
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  sqlite.exec(catalogSeedSql());
});
afterEach(() => sqlite.close());
const query = (params = '') => parseCatalogQuery(new URLSearchParams(params));

describe('Shared catalog persistence', () => {
  it('seeds the canonical corpus idempotently and returns only bounded pages', async () => {
    sqlite.exec(catalogSeedSql());
    const page = await searchStoredCatalog(database, query());
    expect(page.total).toBe(EXPERIENCE_ENTRIES.length);
    expect(page.items).toHaveLength(20);
    expect(page.items.map((item) => item.slug)).toEqual(
      searchCatalogSeed(query()).items.map((item) => item.slug)
    );
    const last = await searchStoredCatalog(database, query('page=1000'));
    expect(last.page).toBe(Math.ceil(page.total / 20));
    expect(last.items).toHaveLength(page.total % 20 || 20);
  });

  it('keeps pending ideas private, then exposes an approved idea across users', async () => {
    const submitted = await submitStoredCatalogIdea(
      database,
      'alice',
      'Teach a neighbour to weave baskets',
      'creative'
    );
    expect(submitted.status).toBe('pending');
    expect((await searchStoredCatalog(database, query('q=weave+baskets'))).matches).toBe(0);
    if (!('id' in submitted)) throw new Error('Missing submission');
    await reviewStoredCatalogIdea(database, submitted.id, 'approve', 'operator');
    const page = await searchStoredCatalog(database, query('q=weave+baskets'));
    expect(page.items).toEqual([
      expect.objectContaining({
        title: 'Teach a neighbour to weave baskets',
        category: 'creative',
        kind: 'idea',
      }),
    ]);
    expect(JSON.stringify(page)).not.toMatch(/alice|userId|reviewedBy|private personal/);
    expect(sqlite.prepare('SELECT title FROM BucketListItem').get()?.title).toBe(
      'A private personal dream'
    );
    expect(
      (
        await submitStoredCatalogIdea(
          database,
          'bob',
          'Teach a neighbour to weave baskets',
          'creative'
        )
      ).status
    ).toBe('already-shared');
  });

  it('rejects without publishing, and prevents another decision on the same submission', async () => {
    const submitted = await submitStoredCatalogIdea(
      database,
      'alice',
      'Host a neighbourhood weaving afternoon',
      'relationships'
    );
    if (!('id' in submitted)) throw new Error('Missing submission');
    await reviewStoredCatalogIdea(database, submitted.id, 'reject', 'operator');
    expect((await searchStoredCatalog(database, query('q=weaving+afternoon'))).matches).toBe(0);
    await expect(
      reviewStoredCatalogIdea(database, submitted.id, 'approve', 'operator')
    ).rejects.toThrow('not pending');
  });

  it('deduplicates repeat submissions and approvals by different users', async () => {
    const first = await submitStoredCatalogIdea(
      database,
      'alice',
      'Make a neighbourhood cookbook',
      'creative'
    );
    expect(
      await submitStoredCatalogIdea(database, 'alice', 'MAKE A NEIGHBOURHOOD COOKBOOK!', 'creative')
    ).toEqual(first);
    const second = await submitStoredCatalogIdea(
      database,
      'bob',
      'Make a neighbourhood cookbook',
      'creative'
    );
    if (!('id' in first) || !('id' in second)) throw new Error('Missing submissions');
    await reviewStoredCatalogIdea(database, first.id, 'approve', 'operator');
    await reviewStoredCatalogIdea(database, second.id, 'approve', 'operator');
    expect((await searchStoredCatalog(database, query('q=neighbourhood+cookbook'))).matches).toBe(
      1
    );
  });

  it('enforces the per-user daily submission bound without blocking another user', async () => {
    for (let index = 0; index < 20; index++)
      await submitStoredCatalogIdea(
        database,
        'alice',
        `Unique community suggestion ${index}`,
        'creative'
      );
    await expect(
      submitStoredCatalogIdea(database, 'alice', 'Another community suggestion', 'creative')
    ).rejects.toThrow('Daily submission limit');
    expect(
      (await submitStoredCatalogIdea(database, 'bob', 'Another community suggestion', 'creative'))
        .status
    ).toBe('pending');
  });

  it('uses bound search parameters, composes filters, and never selects personal lists', async () => {
    const page = await searchStoredCatalog(
      database,
      query('category=travel&kind=destination&pageSize=5')
    );
    expect(page.matches).toBe(75);
    expect(page.items).toHaveLength(5);
    expect((await searchStoredCatalog(database, query('q=%27+OR+1%3D1+--'))).matches).toBe(0);
    expect((await searchStoredCatalog(database, query('q=private+personal+dream'))).matches).toBe(
      0
    );
  });

  it('validates pagination and filters before querying storage', () => {
    for (const params of ['page=0', 'pageSize=21', 'page=1.5', 'category=unknown', 'kind=pending'])
      expect(() => query(params)).toThrow('Invalid catalog');
  });
});
