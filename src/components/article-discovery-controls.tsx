import Link from 'next/link';
import { articleIndexPath, type ArticlePage } from '~/lib/article-discovery';

export function ArticleFiltersForm({ page }: { page: ArticlePage }) {
  return (
    <form
      action="/blog"
      method="get"
      className="mb-8 flex flex-wrap items-end gap-3"
      role="search"
      aria-label="Find an article"
    >
      <label className="min-w-0 flex-1 text-sm text-muted-foreground">
        Search articles
        <input
          type="search"
          name="q"
          defaultValue={page.query}
          placeholder="An activity, a place, or a question"
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-foreground"
        />
      </label>
      <label className="text-sm text-muted-foreground">
        Category
        <select
          name="category"
          defaultValue={page.category}
          className="mt-2 block min-h-11 max-w-full rounded-xl border border-border bg-background px-4 text-foreground"
        >
          <option value="">All categories</option>
          {page.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="min-h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        Find articles
      </button>
    </form>
  );
}

export function ArticleCategoryLinks({ page }: { page: ArticlePage }) {
  return (
    <nav aria-label="Article categories" className="mb-8 flex flex-wrap gap-2 text-sm">
      <Link href="/blog" className="rounded-full border border-border px-3 py-2">
        All articles
      </Link>
      {page.categories.map((category) => (
        <Link
          key={category}
          href={articleIndexPath({ category })}
          aria-current={category === page.category ? 'page' : undefined}
          className="rounded-full border border-border px-3 py-2 text-muted-foreground hover:text-foreground"
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}

export function ArticlePagination({ page }: { page: ArticlePage }) {
  const numbers = [
    ...new Set([
      1,
      ...Array.from({ length: 5 }, (_, index) => page.page + index - 2).filter(
        (value) => value >= 1 && value <= page.pages
      ),
      page.pages,
    ]),
  ].sort((a, b) => a - b);
  return page.pages > 1 ? (
    <nav
      aria-label="Article pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2 text-sm"
    >
      {page.page > 1 ? (
        <Link
          href={articleIndexPath({ ...page, page: page.page - 1 })}
          className="rounded-full border border-border px-4 py-3"
        >
          Previous
        </Link>
      ) : null}
      {numbers.map((number) => (
        <Link
          key={number}
          href={articleIndexPath({ ...page, page: number })}
          aria-label={`Page ${number}`}
          aria-current={number === page.page ? 'page' : undefined}
          className={`min-w-11 rounded-full border px-3 py-3 text-center ${number === page.page ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}
        >
          {number}
        </Link>
      ))}
      {page.page < page.pages ? (
        <Link
          href={articleIndexPath({ ...page, page: page.page + 1 })}
          className="rounded-full border border-border px-4 py-3"
        >
          Next
        </Link>
      ) : null}
    </nav>
  ) : null;
}
