import { CATALOG_CATEGORIES, normalizeCatalogTitle } from '~/lib/catalog-seed';
import type { CatalogPage, CatalogQuery } from '~/lib/catalog-types';
import { EXPERIENCE_ENTRIES } from '~/lib/experiences';

export interface CatalogStatement {
  bind(...values: Array<string | number>): CatalogStatement;
  first<T>(column?: string): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
export interface CatalogDatabase {
  prepare(sql: string): CatalogStatement;
  batch(statements: CatalogStatement[]): Promise<unknown>;
}

type CatalogRow = {
  slug: string;
  title: string;
  description: string | null;
  emoji: string;
  category: CatalogPage['items'][number]['category'];
  kind: CatalogPage['items'][number]['kind'];
};

/** No public reads of submissions, submitters, notes, or personal-list tables. */
export async function searchStoredCatalog(
  database: CatalogDatabase,
  query: CatalogQuery
): Promise<CatalogPage> {
  const conditions: string[] = [];
  const bindings: string[] = [];
  const term = normalizeCatalogTitle(query.query);
  if (term) {
    conditions.push('searchText LIKE ?');
    bindings.push(`%${term}%`);
  }
  if (query.category !== 'all') {
    conditions.push('category = ?');
    bindings.push(query.category);
  }
  if (query.kind !== 'all') {
    conditions.push('kind = ?');
    bindings.push(query.kind);
  }
  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  const total =
    (await database
      .prepare('SELECT count(*) AS count FROM ExperienceCatalog')
      .first<number>('count')) ?? 0;
  const matches =
    (await database
      .prepare(`SELECT count(*) AS count FROM ExperienceCatalog${where}`)
      .bind(...bindings)
      .first<number>('count')) ?? 0;
  const page = Math.min(query.page, Math.max(1, Math.ceil(matches / query.pageSize)));
  const { results } = await database
    .prepare(
      `SELECT slug,title,description,emoji,category,kind FROM ExperienceCatalog${where} ORDER BY sortOrder,slug LIMIT ? OFFSET ?`
    )
    .bind(...bindings, query.pageSize, (page - 1) * query.pageSize)
    .all<CatalogRow>();
  return {
    items: results.map(({ description, ...entry }) => ({
      ...entry,
      ...(description ? { description } : {}),
    })),
    total,
    matches,
    page,
    pageSize: query.pageSize,
    source: 'database',
    categories: CATALOG_CATEGORIES,
  };
}

export async function submitStoredCatalogIdea(
  database: CatalogDatabase,
  userId: string,
  title: string,
  category: string
) {
  const normalized = normalizeCatalogTitle(title);
  const approved = await database
    .prepare('SELECT slug FROM ExperienceCatalog WHERE normalizedTitle = ?')
    .bind(normalized)
    .first<{ slug: string }>();
  if (approved) return { status: 'already-shared' as const };
  // One atomic insert enforces the daily bound even across Worker instances.
  await database
    .prepare(`INSERT INTO CatalogSubmission (id,userId,title,normalizedTitle,category)
    SELECT ?,?,?,?,? WHERE (SELECT count(*) FROM CatalogSubmission WHERE userId = ? AND createdAt >= unixepoch() - 86400) < 20
    ON CONFLICT(userId,normalizedTitle) DO NOTHING`)
    .bind(crypto.randomUUID(), userId, title, normalized, category, userId)
    .run();
  const submission = await database
    .prepare('SELECT id,status FROM CatalogSubmission WHERE userId = ? AND normalizedTitle = ?')
    .bind(userId, normalized)
    .first<{ id: string; status: 'pending' | 'approved' | 'rejected' }>();
  if (!submission) throw new Error('Daily submission limit reached. Try again tomorrow.');
  return submission;
}

/** Operator-only code, deliberately not exposed as an HTTP or server action. */
export async function reviewStoredCatalogIdea(
  database: CatalogDatabase,
  id: string,
  decision: 'approve' | 'reject',
  reviewer: string
) {
  if (!reviewer.trim()) throw new Error('A reviewer is required');
  if (decision === 'approve') {
    const seedCount =
      (await database
        .prepare("SELECT count(*) AS count FROM ExperienceCatalog WHERE source = 'seed'")
        .first<number>('count')) ?? 0;
    if (seedCount < EXPERIENCE_ENTRIES.length)
      throw new Error('Seed the shared catalog before approving submissions.');
  }
  const submission = await database
    .prepare('SELECT status FROM CatalogSubmission WHERE id = ?')
    .bind(id)
    .first<{ status: string }>();
  if (!submission || submission.status !== 'pending') throw new Error('Submission is not pending');
  const update = database
    .prepare(
      `UPDATE CatalogSubmission SET status = ?,reviewedBy = ?,reviewedAt = unixepoch() WHERE id = ? AND status = 'pending'`
    )
    .bind(decision === 'approve' ? 'approved' : 'rejected', reviewer, id);
  if (decision === 'reject') {
    await update.run();
    return;
  }
  await database.batch([
    database
      .prepare(`INSERT INTO ExperienceCatalog (slug,title,normalizedTitle,searchText,emoji,category,kind,source)
      SELECT ?,title,normalizedTitle,normalizedTitle,'✨',category,'idea','community' FROM CatalogSubmission WHERE id = ? AND status = 'pending'
      ON CONFLICT(normalizedTitle) DO NOTHING`)
      .bind(`community-${crypto.randomUUID()}`, id),
    update,
  ]);
}
