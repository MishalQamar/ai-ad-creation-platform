'use client';
import { Loader2 } from 'lucide-react';
import { CharacterCard, Character } from './character-card';

interface CharacterListProps {
  characters: Character[];
  onSelect: (characterUrl: string) => void;
  onDelete?: (characterId: string) => void;
  deletingId?: string | null;
}

export function CharacterList({
  characters,
  onSelect,
  onDelete,
  deletingId,
}: CharacterListProps) {
  return (
    <div className="grid grid-cols-5 gap-6 max-h-[500px] overflow-y-auto p-2">
      {characters === undefined ? (
        <div className="col-span-5 flex items-center justify-center min-h-[400px] gap-2">
          <Loader2 className="size-4 animate-spin" />
          <p className="text-muted-foreground">
            Loading characters...
          </p>
        </div>
      ) : characters.length === 0 ? (
        <div className="col-span-5 flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">No characters found</p>
        </div>
      ) : (
        characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onSelect={onSelect}
            onDelete={onDelete}
            isDeleting={deletingId === character.id}
          />
        ))
      )}
    </div>
  );
}
