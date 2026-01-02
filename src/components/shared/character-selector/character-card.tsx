'use client';
import Image from 'next/image';

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
}

interface CharacterCardProps {
  character: Character;
  onSelect: (characterUrl: string) => void;
}

export function CharacterCard({
  character,
  onSelect,
}: CharacterCardProps) {
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
      </div>
      <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
        {character.name}
      </span>
    </div>
  );
}
