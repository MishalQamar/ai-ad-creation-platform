/* import { internalMutation } from './_generated/server';

export const backfillMissingCredits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    let updatedCount = 0;
    for (const user of users) {
      if (user.credits === undefined) {
        await ctx.db.patch(user._id, {
          credits: 2,
          updatedAt: Date.now(),
        });
        updatedCount++;
      }
    }
    return {
      totalUsers: users.length,
      updatedCount,
    };
  },
});
 */
