import { query } from '../_generated/server';
import { getCurrentUserOrThrow } from '../users';

export const listSystemCharacters = query({
  args: {},
  handler: async (ctx) => {
    const characters = await ctx.db
      .query('characters')
      .withIndex('by_user_id', (q) => q.eq('userId', undefined))
      .order('desc')
      .collect();
    return characters;
  },
});

export const listUserCharacters = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    const characters = await ctx.db
      .query('characters')
      .withIndex('by_user_id', (q) => q.eq('userId', user.clerkId))
      .order('desc')
      .collect();
    return characters;
  },
});
