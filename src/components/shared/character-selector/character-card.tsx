'use client';
import { Loader2, Trash } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
}

interface CharacterCardProps {
  character: Character;
  onSelect: (characterUrl: string) => void;
  onDelete?: (characterId: string) => void;
  isDeleting?: boolean;
}

export function CharacterCard({
  character,
  onSelect,
  onDelete,
  isDeleting = false,
}: CharacterCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete && !isDeleting) {
      onDelete(character.id);
    }
  };

  return (
    <div
      className="group relative flex flex-col cursor-pointer"
      onClick={() => onSelect(character.imageUrl)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden border border-border/50 transition-all group-hover:ring-2 group-hover:ring-primary/50">
        <Image
          src={character.imageUrl}
          alt={character.name}
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash className="size-4" />
            )}
          </Button>
        )}
      </div>
      <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
        {character.name}
      </span>
    </div>
  );
}
