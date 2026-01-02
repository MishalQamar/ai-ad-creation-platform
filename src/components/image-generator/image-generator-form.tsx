'use client';

import {
  IMAGE_GENERATION_MODELS,
  IMAGE_ASPECT_RATIOS,
} from '@/lib/constants';
import { ImageSchema, imageSchema } from '@/lib/schema';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CrownIcon, Loader2, UploadIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { CharacterSelector } from '../shared/character-selector';
import Image from 'next/image';

export const ImageGeneratorForm = () => {
  const [isCharacterSelectorOpen, setIsCharacterSelectorOpen] =
    useState(false);

  const form = useForm<ImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      model: IMAGE_GENERATION_MODELS[0].value,
      aspectRatio: IMAGE_ASPECT_RATIOS[0].value,
      prompt: '',
      characterImageUrl: undefined,
      objectImageUrl: undefined,
    },
  });

  async function onSubmit(values: ImageSchema) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Handle form submission
    toast.success('Image generated successfully');
  }

  const isSubmitting = form.formState.isSubmitting;

  const characterImageUrl = useWatch({
    control: form.control,
    name: 'characterImageUrl',
  });
  const objectImageUrl = useWatch({
    control: form.control,
    name: 'objectImageUrl',
  });

  return (
    <div className="flex flex-col gap-6 border rounded-md p-4 h-full">
      <div className="flex flex-col gap-2 ">
        <h2 className="text-2xl font-bold tracking-tight">
          Generate Images
        </h2>
        <p className="text-muted-foreground">
          Create stunning images with AI
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Model Select */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_GENERATION_MODELS.map((model) => (
                        <SelectItem
                          key={model.value}
                          value={model.value}
                        >
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference section */}
          <div className="space-y-4">
            <FormLabel>Reference Images</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {/* Character Options */}
              <div
                onClick={() => setIsCharacterSelectorOpen(true)}
                className="relative flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:bg-accent/50 aspect-square border-muted-foreground/25 overflow-hidden"
              >
                {characterImageUrl ? (
                  <>
                    <Image
                      src={characterImageUrl}
                      alt="Character"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        form.setValue('characterImageUrl', undefined);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-all z-10"
                    >
                      <X className="size-4 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <CrownIcon className="size-6 mb-2 text-amber-500" />
                    <span className="text-xs font-medium">
                      Character
                    </span>
                  </>
                )}
              </div>
              {/* Object Options */}
              <div className="relative flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed cursor-pointer aspect-square border-muted-foreground/25 overflow-hidden">
                {objectImageUrl ? (
                  <>
                    <Image
                      src={objectImageUrl}
                      alt="Object"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                      Object
                    </span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="size-6 mb-2 text-muted-foreground" />
                    <span className="text-xs font-medium">
                      Object
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your image"
                    className="min-h-[120px] resize-none"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Aspect ratio */}
          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aspect Ratio</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_ASPECT_RATIOS.map((aspectRatio) => (
                        <SelectItem
                          key={aspectRatio.value}
                          value={aspectRatio.value}
                        >
                          {aspectRatio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Generate Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Generate Image'
            )}
          </Button>
        </form>
      </Form>
      <CharacterSelector
        open={isCharacterSelectorOpen}
        onOpenChange={setIsCharacterSelectorOpen}
        onSelect={(characterUrl) => {
          form.setValue('characterImageUrl', characterUrl);
          setIsCharacterSelectorOpen(false);
        }}
      />
    </div>
  );
};
