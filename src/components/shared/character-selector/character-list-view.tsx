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
import { useAction } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteCharacter = useAction(
    api.characters.actions.deleteUserCharacterImage
  );

  const handleDeleteCharacter = async (characterId: string) => {
    if (deletingId) return;
    if (!confirm('Are you sure you want to delete this character?'))
      return;
    setDeletingId(characterId);
    try {
      await deleteCharacter({
        characterId: characterId as Id<'characters'>,
      });
      toast.success('Character deleted successfully');
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('Failed to delete character');
    } finally {
      setDeletingId(null);
    }
  };

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
            onDelete={handleDeleteCharacter}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
