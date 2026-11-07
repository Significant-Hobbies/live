import { CATALOG_CATEGORIES, normalizeCatalogTitle } from '~/lib/catalog-seed';
import type { CatalogPage, CatalogQuery } from '~/lib/catalog-types';
import {
  catalogPage,
  isBundledCatalogTitle,
  mergePublicCatalog,
  type PublicCatalogRow,
} from '~/lib/catalog-model';

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

/** This projection deliberately excludes submissions and all user/private tables. */
export async function readStoredPublicCatalog(database: CatalogDatabase) {
  const { results } = await database
    .prepare(
      'SELECT slug,title,description,emoji,category,kind FROM ExperienceCatalog ORDER BY sortOrder,slug'
    )
    .all<PublicCatalogRow>();
  return mergePublicCatalog(results, 'database');
}

export async function searchStoredCatalog(
  database: CatalogDatabase,
  query: CatalogQuery
): Promise<CatalogPage> {
  return catalogPage(await readStoredPublicCatalog(database), query, CATALOG_CATEGORIES);
}

export async function submitStoredCatalogIdea(
  database: CatalogDatabase,
  userId: string,
  title: string,
  category: string
) {
  const normalized = normalizeCatalogTitle(title);
  if (isBundledCatalogTitle(title)) return { status: 'already-shared' as const };
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
  const submission = await database
    .prepare('SELECT status,title FROM CatalogSubmission WHERE id = ?')
    .bind(id)
    .first<{ status: string; title: string }>();
  if (!submission || submission.status !== 'pending') throw new Error('Submission is not pending');
  const update = database
    .prepare(
      `UPDATE CatalogSubmission SET status = ?,reviewedBy = ?,reviewedAt = unixepoch() WHERE id = ? AND status = 'pending'`
    )
    .bind(decision === 'approve' ? 'approved' : 'rejected', reviewer, id);
  if (decision === 'reject' || isBundledCatalogTitle(submission.title)) {
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
