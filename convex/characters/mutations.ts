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

export const deleteCharacter = mutation({
  args: {
    characterId: v.id('characters'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const character = await ctx.db.get(args.characterId);
    if (!character || character.userId !== user.clerkId) {
      throw new Error('cannot delete character');
    }
    await ctx.db.delete(args.characterId);
    return { imageFileId: character.imageFileId };
  },
});
