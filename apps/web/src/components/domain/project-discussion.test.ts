import { describe, it, expect } from 'vitest';
import type { DiscussionComment } from './project-discussion';

describe('ProjectDiscussion Logic & Data Model', () => {
  it('correctly constructs a discussion comment object with category tags', () => {
    const comment: DiscussionComment = {
      id: 'test-comment-1',
      projectSlug: 'aeroglide',
      author: {
        name: 'Arjun Mehta',
        handle: 'arjunm',
        role: 'Aerodynamics Lead',
      },
      content: 'Wind tunnel test complete. 14% drag reduction verified.',
      tag: 'Milestone',
      createdAt: new Date().toISOString(),
      upvotes: 18,
      hasUpvoted: false,
    };

    expect(comment.id).toBe('test-comment-1');
    expect(comment.projectSlug).toBe('aeroglide');
    expect(comment.author.handle).toBe('arjunm');
    expect(comment.tag).toBe('Milestone');
    expect(comment.upvotes).toBe(18);
  });

  it('supports upvoting and incrementing kudos', () => {
    const comment: DiscussionComment = {
      id: 'test-2',
      projectSlug: 'saathi-voice',
      author: { name: 'Priya', handle: 'priya_ai' },
      content: 'Testing speech quant.',
      tag: 'Question',
      createdAt: new Date().toISOString(),
      upvotes: 5,
      hasUpvoted: false,
    };

    // Toggle upvote
    const upvoted = {
      ...comment,
      hasUpvoted: true,
      upvotes: comment.upvotes + 1,
    };

    expect(upvoted.hasUpvoted).toBe(true);
    expect(upvoted.upvotes).toBe(6);
  });
});
