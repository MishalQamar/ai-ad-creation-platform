import { upload } from '@imagekit/next';

interface AuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

export async function uploadToImageKit(
  file: File,
  folder: string,

  fileName: string,
  authParams: AuthParams
): Promise<{ url: string; fileId: string }> {
  const { token, expire, signature, publicKey } = authParams;

  //upload using imagekit sdk
  const result = await upload({
    file,
    fileName,
    folder,
    token,
    expire,
    signature,
    publicKey,
  });

  if (!result.url || !result.fileId) {
    throw new Error('Failed to upload file to ImageKit');
  }

  return {
    url: result.url,
    fileId: result.fileId,
  };
}
