import { Button } from '@/components/ui/button';
import { CharacterSchema, characterSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, Loader2, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { uploadToImageKit } from '@/lib/imagekit.client';

interface CreateCharacterViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateCharacterView({
  onBack,
  onSuccess,
}: CreateCharacterViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const getUploadAuth = useAction(
    api.characters.actions.getUploadAuth
  );
  const createCharacter = useMutation(
    api.characters.mutations.createCharacter
  );

  const form = useForm<CharacterSchema>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageUrl', file, { shouldValidate: true });
    }
  };
  const onSubmit = async (values: CharacterSchema) => {
    setIsLoading(true);
    if (!user) {
      toast.error('You must be logged in to create a character');
      setIsLoading(false);
      return;
    }
    try {
      const authParams = await getUploadAuth();

      const uploadResult = await uploadToImageKit(
        values.imageUrl,
        `characters/${user.id}`,
        `${values.name.replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
        authParams
      );

      // Save character to convex database with url and fileId

      await createCharacter({
        name: values.name,
        imageUrl: uploadResult.url,
        imageFileId: uploadResult.fileId,
        userId: user.id,
      });

      toast.success('Character created successfully');
      setIsLoading(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to create character');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const imageFile = useWatch({
    control: form.control,
    name: 'imageUrl',
  });
  const imageUrl =
    imageFile instanceof File ? URL.createObjectURL(imageFile) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 -ml-2"
          onClick={onBack}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h2 className="text-lg font-semibold">Create Character</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-6"
        >
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="@name"
                      className="bg-secondary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Character'
              )}
            </Button>
          </div>
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                field: { value: _value, ...fieldProps },
              }) => (
                <FormItem>
                  <FormLabel>Character Image</FormLabel>
                  <FormControl>
                    <div className="relative border-2 border-dashed border-border rounded-lg h-[200px] flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/20 transition-colors cursor-pointer group overflow-hidden">
                      <input
                        type="file"
                        {...fieldProps}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Character preview"
                          fill
                          className="object-contain rounded-lg"
                          unoptimized
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <UploadIcon className="size-8 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                          <p className="text-sm text-center px-4">
                            Upload your character image
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
