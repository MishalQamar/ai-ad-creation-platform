import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { getCurrentUserOrThrow } from '../users';

export const createCharacter = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    imageFileId: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const characterId = await ctx.db.insert('characters', {
      name: args.name,
      imageUrl: args.imageUrl,
      imageFileId: args.imageFileId,
      userId: user.clerkId,
    });
    return characterId;
  },
});
