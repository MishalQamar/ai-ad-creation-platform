import { query } from '../_generated/server';
import { getCurrentUserOrThrow } from '../users';

export const getUserSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_id', (q) => q.eq('userId', user.clerkId))
      .first();

    return {
      subscription,
      isPro:
        subscription?.polarProductId ===
        process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID,
      isEnterprise:
        subscription?.polarProductId ===
        process.env.NEXT_PUBLIC_POLAR_ENTERPRISE_PRODUCT_ID,
    };
  },
});
