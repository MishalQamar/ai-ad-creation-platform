'use client';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { CrownIcon, UploadIcon } from 'lucide-react';
import { CharacterSearch } from './character-search';
import { CharacterList } from './character-list';
import { Character } from './character-card';

interface CharacterListViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  characters: Character[];
  onSelect: (characterUrl: string) => void;
  onNewCharacter: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CharacterListView({
  searchQuery,
  onSearchChange,
  characters,
  onSelect,
  onNewCharacter,
  activeTab,
  onTabChange,
}: CharacterListViewProps) {
  return (
    <>
      <CharacterSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onNewCharacter={onNewCharacter}
      />

      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col flex-1 min-h-0"
      >
        <TabsList className="h-10 p-1">
          <TabsTrigger
            className="flex items-center gap-2"
            value="Library"
          >
            <CrownIcon className="size-4 text-amber-500" />
            Library
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-2"
            value="my-characters"
          >
            <UploadIcon className="size-4" />
            My Characters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Library">
          <CharacterList
            characters={characters}
            onSelect={onSelect}
          />
        </TabsContent>
        <TabsContent value="my-characters">
          <CharacterList
            characters={characters}
            onSelect={onSelect}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
