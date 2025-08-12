// hooks/useKanban.ts
import { useState, useEffect } from 'react';
import { UserStoryService } from '../services/userStoryService';
import { StoryStatus, type UserStory, type UserStoryCreate } from '../types/userStory';

interface KanbanState {
    stories: UserStory[];
    loading: boolean;
    error: string | null;
}

export const useKanban = (boardId: number) => {
    const [state, setState] = useState<KanbanState>({
        stories: [],
        loading: true,
        error: null,
    });

    // ✅ Stories laden beim Mount/boardId-Wechsel
    useEffect(() => {
        loadStories();
    }, [boardId]);

    const setLoading = (loading: boolean) => {
        setState((prev) => ({ ...prev, loading }));
    };

    const setError = (error: string | null) => {
        setState((prev) => ({ ...prev, error, loading: false }));
    };

    // ✅ ALLE STORIES VOM BACKEND LADEN
    const loadStories = async () => {
        try {
            setLoading(true);
            setError(null);
            const stories = await UserStoryService.getStoriesForBoard(boardId);
            setState({ stories, loading: false, error: null });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load stories');
        }
    };

    // ✅ NEUE STORY ERSTELLEN
    const createStory = async (storyData: Omit<UserStoryCreate, 'board_id'>): Promise<boolean> => {
        try {
            setError(null);
            // Füge status hinzu falls nicht vorhanden
            const completeStoryData = {
                ...storyData,
                status: storyData.status || StoryStatus.TODO
            };
            const newStory = await UserStoryService.createStory(completeStoryData, boardId);
            setState((prev) => ({
                ...prev,
                stories: [...prev.stories, newStory],
            }));
            return true;
        } catch (error) {
            console.error('❌ Story creation failed:', error);
            console.error('❌ Error details:', JSON.stringify(error, null, 2));

            if (error instanceof Error) {
                console.error('❌ Error message:', error.message);
            }

            setError(error instanceof Error ? error.message : 'Failed to create story');
            return false;
        }
    };

    // ✅ STORY STATUS ÄNDERN (DRAG & DROP)
    const moveStory = async (storyId: number, newStatus: StoryStatus): Promise<boolean> => {
        try {
            setError(null);
            const updatedStory = await UserStoryService.moveStoryStatus(storyId, newStatus);
            setState((prev) => ({
                ...prev,
                stories: prev.stories.map((story) =>
                    story.id === storyId ? updatedStory : story
                ),
            }));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to move story');
            return false;
        }
    };

    // ✅ STORY BEARBEITEN/AKTUALISIEREN
    const updateStory = async (storyId: number, updates: Partial<UserStoryCreate>): Promise<boolean> => {
        try {
            setError(null);
            const updatedStory = await UserStoryService.updateStory(storyId, updates);
            setState((prev) => ({
                ...prev,
                stories: prev.stories.map((story) =>
                    story.id === storyId ? updatedStory : story
                ),
            }));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update story');
            return false;
        }
    };

    // ✅ STORY LÖSCHEN
    const deleteStory = async (storyId: number): Promise<boolean> => {
        try {
            setError(null);
            await UserStoryService.deleteStory(storyId);
            setState((prev) => ({
                ...prev,
                stories: prev.stories.filter((story) => story.id !== storyId),
            }));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete story');
            return false;
        }
    };

    // ✅ STORIES NACH STATUS GRUPPIEREN
    const getStoriesByStatus = (status: StoryStatus): UserStory[] => {
        return state.stories.filter((story) => story.status === status);
    };

    return {
        // State
        stories: state.stories,
        loading: state.loading,
        error: state.error,

        // Actions
        loadStories,
        createStory,
        updateStory,
        moveStory,
        deleteStory,

        // Computed
        getStoriesByStatus,
    };
};