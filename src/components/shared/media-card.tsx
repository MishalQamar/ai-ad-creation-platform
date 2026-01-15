import { toast } from 'sonner';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import { formatDistanceToNow } from 'date-fns';
import { Copy, Download, Link2Icon } from 'lucide-react';

interface MediaCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'image' | 'video';
  data: {
    url: string;
    prompt: string;
    model: string;
    aspectRatio: string;
    createdAt: number;
    user: {
      name: string;
      imageUrl?: string;
    };
  } | null;
}

export function MediaCard({
  open,
  onOpenChange,
  type,
  data,
}: MediaCardProps) {
  if (!data) return null;
  const handleCopyPromptClick = () => {
    navigator.clipboard.writeText(data.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleDownload = async (
    url: string,
    type: 'image' | 'video'
  ) => {
    try {
      //fetch the image a as blob
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();

      //build filename
      const timestamp = new Date().getTime();
      const filename = `generated-${
        type === 'image' ? 'image' : 'video'
      }(${timestamp})`;

      const objectUrl = URL.createObjectURL(blob);

      //create a <a> tag to trigger the download
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      //cleanup the object url to free the memory
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      toast.success(
        `${
          type === 'image' ? 'Image' : 'Video'
        } downloaded successfully`
      );
    } catch {
      toast.error(
        `Failed to download ${type === 'image' ? 'image' : 'video'}`
      );
    }
  };
  const handleCopyUrlClick = () => {
    navigator.clipboard.writeText(data.url);
    toast.success(
      `${
        type === 'image' ? 'Image' : 'Video'
      } URL copied to clipboard`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] p-0 gap-0 bg-card border-none overflow-hidden rounded-2xl sm:max-w-4xl">
        <DialogTitle className="sr-only">
          {type === 'image' ? 'Image' : 'Video'} Details
        </DialogTitle>
        <DialogDescription className="sr-only">
          Details of the selected{' '}
          {type === 'image' ? 'image' : 'video'} generation.
        </DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] h-[85vh] md:h-[600px]">
          {/* Left side */}
          <div className="bg-muted/30 flex items-center justify-center overflow-hidden relative">
            {type === 'image' ? (
              <Image
                src={data.url}
                alt={data.prompt}
                className="object-contain"
                fill
              />
            ) : (
              <video
                src={data.url}
                className="max-w-full max-h-full object-contain"
                controls
                loop
                autoPlay
                muted
                playsInline
              />
            )}
          </div>

          {/* Right side */}
          <div className="flex flex-col p-6 bg-muted/30 text-foreground h-full overflow-y-auto border-l border-none">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={data.user?.imageUrl} />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {data.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold">
                    {data.user?.name || 'Anonymous'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(data.createdAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 ">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Prompt
                </span>
                <button
                  className="text-muted-foreground hover:text-accent-foreground cursor-pointer"
                  onClick={handleCopyPromptClick}
                >
                  <Copy className="size-3" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.prompt}
              </p>
            </div>

            {/* metadata section */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 px-4 rounded-md font-medium text-xs text-foreground bg-accent/80">
                  <span>Model</span>
                  <span>{data.model}</span>
                </div>
                <div className="flex items-center justify-between p-3 px-4 rounded-md font-medium text-xs text-foreground bg-accent/80">
                  <span>Aspect Ratio</span>
                  <span>{data.aspectRatio}</span>
                </div>
              </div>
            </div>
            {/* Actions section */}
            <div className="mt-auto space-y-6">
              <button
                className="flex items-center gap-3 text-xs font-bold text-muted-foreground hover:text-accent-foreground cursor-pointer"
                onClick={handleCopyUrlClick}
              >
                <Link2Icon className="size-4" />
                <span>Copy URL</span>
              </button>
              <button
                className="flex items-center gap-3 text-xs font-bold text-muted-foreground hover:text-accent-foreground cursor-pointer"
                onClick={() => handleDownload(data.url, type)}
              >
                <Download className="size-4" />
                <span>
                  Download {type === 'image' ? 'Image' : 'Video'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
