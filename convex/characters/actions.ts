'use node';

import { v } from 'convex/values';
import { api } from '../_generated/api';
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

export const deleteUserCharacterImage = action({
  args: {
    characterId: v.id('characters'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.runMutation(
      api.characters.mutations.deleteCharacter,
      {
        characterId: args.characterId,
      }
    );
    const imageKitResult = { success: false };
    if (result.imageFileId) {
      try {
        await imageKit.deleteFile(result.imageFileId);
        imageKitResult.success = true;
      } catch (error) {
        console.error('Error deleting image from ImageKit:', error);
        imageKitResult.success = false;
      }
    }
    return {
      success: true,
      imageKitdeleted: imageKitResult.success,
    };
  },
});
