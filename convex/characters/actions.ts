'use node';

import { action } from '../_generated/server';
import ImageKit from 'imagekit';

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const getUploadAuth = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    const authParams = imageKit.getAuthenticationParameters();

    return {
      ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    };
  },
});
