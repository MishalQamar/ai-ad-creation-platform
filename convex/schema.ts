import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    credits: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  characters: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    imageFileId: v.optional(v.string()),
    userId: v.optional(
      v.string()
    ) /* optional because characters can be created by system, stores Clerk user ID */,
  }).index('by_user_id', ['userId']),
});
