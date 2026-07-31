import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('retired social runtime', () => {
  it('keeps public profiles and timelines free of retired social controls and reads', () => {
    const sources = [
      'src/app/u/[username]/page.tsx',
      'src/app/u/[username]/[slug]/page.tsx',
      'src/app/timeline/[id]/page.tsx',
      'src/app/explore/page.tsx',
      'src/app/explore/explore-client.tsx',
    ].map(readSource);

    for (const source of sources) {
      expect(source).not.toMatch(
        /FollowButton|LikeButton|CommentsSectionWithOwn|likesTable|commentsTable|most-liked|likeCount/
      );
    }
  });

  it('keeps the social writer actions retired', () => {
    expect(readSource('src/lib/actions/user.ts')).not.toMatch(/export async function toggleFollow/);
    expect(readSource('src/lib/actions/timeline.ts')).not.toMatch(
      /export async function (toggleLike|addComment|deleteComment)/
    );
  });
});
