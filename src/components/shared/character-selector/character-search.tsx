'use client';
import { Search, PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CharacterSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewCharacter?: () => void;
}

export function CharacterSearch({
  searchQuery,
  onSearchChange,
  onNewCharacter,
}: CharacterSearchProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button onClick={onNewCharacter}>
        <PlusIcon className="size-4" />
        <span>New Character</span>
      </Button>
    </div>
  );
}
