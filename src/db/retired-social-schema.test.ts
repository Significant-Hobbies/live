import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { describe, expect, it } from 'vitest';

import { comments, follows, likes } from './schema';

describe('retired social storage', () => {
  it('keeps the legacy tables declared so migration generation cannot drop them', () => {
    expect(getTableConfig(likes).name).toBe('Like');
    expect(getTableConfig(comments).name).toBe('Comment');
    expect(getTableConfig(follows).name).toBe('Follow');
  });

  it('keeps the historical identity and lookup indexes intact', () => {
    expect(getTableConfig(likes).indexes.map((index) => index.config.name)).toContain(
      'Like_userId_timelineId_key'
    );
    expect(getTableConfig(comments).indexes.map((index) => index.config.name)).toEqual(
      expect.arrayContaining(['Comment_userId_idx', 'Comment_timelineId_idx'])
    );
    expect(getTableConfig(follows).indexes.map((index) => index.config.name)).toContain(
      'Follow_followerId_followingId_key'
    );
  });
});
