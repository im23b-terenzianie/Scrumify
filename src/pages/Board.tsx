import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    useDroppable,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, Edit2, AlertCircle } from 'lucide-react'
import StoryCard from '../components/StoryCard'
import AddStoryForm from '../components/AddStoryForm'
import StoryDetailModal from '../components/StoryDetailModal'
import { useKanban } from '../hooks/useKanban'
import { StoryStatus, StoryPriority, type UserStory, type UserStoryCreate } from '../types/userStory'

//  Status-zu-Spalten-Mapping - EXAKT nach Backend Schema
const COLUMN_CONFIG = [
    { id: 'todo', title: 'To Do', status: StoryStatus.TODO },
    { id: 'in_progress', title: 'In Progress', status: StoryStatus.IN_PROGRESS },
    { id: 'in_review', title: 'In Review', status: StoryStatus.IN_REVIEW },
    { id: 'done', title: 'Done', status: StoryStatus.DONE },
] as const

type Column = {
    id: string
    title: string
    status: StoryStatus
    stories: UserStory[]
    isCustom?: boolean
}

type CustomColumnData = {
    id: string
    title: string
    stories: UserStory[] // Local stories for custom columns
}

export default function Board() {
    const { projectId, boardId } = useParams()

    // Use boardId from URL if available, otherwise fallback to projectId for backwards compatibility
    const currentBoardId = boardId || projectId || '1'

    // Support both numeric and UUID board IDs
    const boardIdForApi = isNaN(Number(currentBoardId)) ? currentBoardId : parseInt(currentBoardId)

    //  Kanban Hook für API-Integration
    const {
        stories,
        loading,
        error,
        createStory,
        updateStory,
        moveStory,
        deleteStory,
        getStoriesByStatus
    } = useKanban(boardIdForApi)

    // UI State
    const [activeStory, setActiveStory] = useState<UserStory | null>(null)
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
    const [editingColumnTitle, setEditingColumnTitle] = useState<string>('')
    const [showAddStoryForm, setShowAddStoryForm] = useState<string | null>(null) // Changed to string to support custom column IDs
    const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
    const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null)
    const [showAddColumn, setShowAddColumn] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')

    // Load and save custom columns from/to localStorage
    const [customColumns, setCustomColumns] = useState<CustomColumnData[]>(() => {
        try {
            const saved = localStorage.getItem(`customColumns_${currentBoardId}`)
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    // Track which stories have been moved to custom columns
    const getCustomStoryTracker = () => {
        try {
            return JSON.parse(localStorage.getItem(`customStoryTracker_${currentBoardId}`) || '{}')
        } catch {
            return {}
        }
    }

    // Helper function to check if a story is local (created in custom column)
    const isLocalStory = (storyId: number): boolean => {
        // Local stories use Date.now() which creates IDs > 1000000000000 (year 2001+)
        // Backend IDs are typically much smaller sequential numbers
        return storyId > 1000000000000
    }

    // Helper function to get filtered stories (excludes stories that are in custom columns)
    const getFilteredStoriesByStatus = (status: StoryStatus): UserStory[] => {
        const tracker = getCustomStoryTracker()
        return getStoriesByStatus(status).filter(story => !tracker[story.id])
    }

    // Save custom columns to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`customColumns_${currentBoardId}`, JSON.stringify(customColumns))
    }, [customColumns, currentBoardId])

    //  Spalten mit Stories aus dem Backend + Custom Columns
    const columns: Column[] = [
        ...COLUMN_CONFIG.map(config => ({
            ...config,
            stories: getFilteredStoriesByStatus(config.status), // Use filtered stories
            isCustom: false
        })),
        ...customColumns.map(customCol => ({
            id: customCol.id,
            title: customCol.title,
            status: StoryStatus.TODO, // Custom columns use TODO as base status
            stories: customCol.stories || [],
            isCustom: true
        }))
    ]

    //  NEUE STORY ERSTELLEN - Backend Guide kompatibel
    const handleCreateStory = async (storyData: Omit<UserStoryCreate, 'board_id'>) => {
        // Find which column the form is being shown for
        const targetColumn = columns.find(col => col.id === showAddStoryForm)

        if (targetColumn?.isCustom) {
            // For custom columns, create a local story
            const localStory: UserStory = {
                id: Date.now() + Math.floor(Math.random() * 1000), // Ensure unique temporary ID for local stories
                title: storyData.title,
                description: storyData.description || null,
                status: StoryStatus.TODO, // Custom stories use TODO as base status
                priority: storyData.priority || StoryPriority.MEDIUM,
                story_points: storyData.story_points || null,
                user_type: storyData.user_type || null,
                user_action: storyData.user_action || null,
                user_benefit: storyData.user_benefit || null,
                acceptance_criteria: storyData.acceptance_criteria || null,
                assignee: undefined,
                assignee_id: null,
                board_id: typeof boardIdForApi === 'string' ? parseInt(boardIdForApi) || 1 : boardIdForApi,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                owner_id: 1, // Placeholder for local stories
            }

            // Add to custom column
            setCustomColumns(prev =>
                prev.map(col =>
                    col.id === targetColumn.id
                        ? { ...col, stories: [...(col.stories || []), localStory] }
                        : col
                )
            )

            setShowAddStoryForm(null)
            return
        }

        // For standard columns, use the normal API
        const storyStatus = targetColumn?.status || StoryStatus.TODO
        const completeStoryData = {
            ...storyData,
            status: storyStatus,
        }

        const success = await createStory(completeStoryData)
        if (success) {
            setShowAddStoryForm(null)
        }
    }

    // ✅ STORY DETAIL MODAL ÖFFNEN
    const handleStoryClick = (story: UserStory) => {
        setSelectedStory(story);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Reduced for smoother start
            },
        })
    )

    const scrollLeft = () => {
        if (scrollContainerRef) {
            scrollContainerRef.scrollBy({ left: -320, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef) {
            scrollContainerRef.scrollBy({ left: 320, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                scrollLeft()
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                scrollRight()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [scrollContainerRef])

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const story = findStoryById(active.id.toString())
        setActiveStory(story)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveStory(null)

        if (!over) return

        const activeStoryId = parseInt(active.id.toString())
        const overId = over.id as string

        // Find the story in all columns (including custom ones)
        let activeStory: UserStory | null = null
        let sourceColumn: Column | null = null

        for (const column of columns) {
            const story = column.stories.find(s => s.id === activeStoryId)
            if (story) {
                activeStory = story
                sourceColumn = column
                break
            }
        }

        if (!activeStory || !sourceColumn) return

        const targetColumn = columns.find(col => col.id === overId)
        if (!targetColumn || targetColumn.id === sourceColumn.id) return

        // Handle moves between different types of columns
        if (sourceColumn.isCustom && targetColumn.isCustom) {
            // Move between custom columns
            setCustomColumns(prev =>
                prev.map(col => {
                    if (col.id === sourceColumn.id) {
                        return { ...col, stories: col.stories.filter(s => s.id !== activeStoryId) }
                    }
                    if (col.id === targetColumn.id) {
                        return { ...col, stories: [...(col.stories || []), activeStory] }
                    }
                    return col
                })
            )
        } else if (sourceColumn.isCustom && !targetColumn.isCustom) {
            // Move from custom column to standard column
            // Check if this is a local story (created in custom column) or a backend story moved to custom
            const isLocalStoryCheck = isLocalStory(activeStory.id)

            if (isLocalStoryCheck) {
                // This is a local story - create it in the backend first
                try {
                    const storyData = {
                        title: activeStory.title,
                        description: activeStory.description || undefined,
                        priority: activeStory.priority,
                        story_points: activeStory.story_points || undefined,
                        user_type: activeStory.user_type || undefined,
                        user_action: activeStory.user_action || undefined,
                        user_benefit: activeStory.user_benefit || undefined,
                        acceptance_criteria: activeStory.acceptance_criteria || undefined,
                        status: targetColumn.status
                    }

                    // Create in backend with the target status
                    const success = await createStory(storyData)

                    if (success) {
                        // Remove from custom column
                        setCustomColumns(prev =>
                            prev.map(col =>
                                col.id === sourceColumn.id
                                    ? { ...col, stories: col.stories.filter(s => s.id !== activeStoryId) }
                                    : col
                            )
                        )
                    }
                } catch (error) {
                    console.error('Failed to create story in backend:', error)
                    // Revert the UI change if creation failed
                    return
                }
            } else {
                // This is a backend story that was moved to custom - move it back normally
                // Remove from custom column
                setCustomColumns(prev =>
                    prev.map(col =>
                        col.id === sourceColumn.id
                            ? { ...col, stories: col.stories.filter(s => s.id !== activeStoryId) }
                            : col
                    )
                )

                // Remove from custom story tracker
                try {
                    const customStoryTracker = getCustomStoryTracker()
                    delete customStoryTracker[activeStoryId]
                    localStorage.setItem(`customStoryTracker_${currentBoardId}`, JSON.stringify(customStoryTracker))
                } catch (error) {
                    console.error('Failed to update custom story tracker:', error)
                }

                // Move in backend via API
                await moveStory(activeStoryId, targetColumn.status)
            }
        } else if (!sourceColumn.isCustom && targetColumn.isCustom) {
            // Move from standard column to custom column
            // First, add to custom column
            setCustomColumns(prev =>
                prev.map(col =>
                    col.id === targetColumn.id
                        ? { ...col, stories: [...(col.stories || []), activeStory] }
                        : col
                )
            )

            // Then remove from backend by changing status to a hidden/archived state
            // Since we don't have a "hidden" status, we'll need to track which stories are in custom columns
            // and filter them out from standard columns in our display logic
            // For now, we'll mark the story as moved to custom
            try {
                // We need to track that this story is now in a custom column
                const customStoryTracker = JSON.parse(localStorage.getItem(`customStoryTracker_${currentBoardId}`) || '{}')
                customStoryTracker[activeStoryId] = targetColumn.id
                localStorage.setItem(`customStoryTracker_${currentBoardId}`, JSON.stringify(customStoryTracker))

                // Refresh stories to reflect the change
                setTimeout(() => {
                    // This will cause a re-render and the story should disappear from the standard column
                    setCustomColumns(prev => [...prev])
                }, 100)
            } catch (error) {
                console.error('Failed to track custom story:', error)
            }
        } else {
            // Move between standard columns
            await moveStory(activeStoryId, targetColumn.status)
        }
    }

    const findStoryById = (id: string): UserStory | null => {
        const storyId = parseInt(id)

        // First check backend stories
        const backendStory = stories.find(story => story.id === storyId)
        if (backendStory) return backendStory

        // Then check custom column stories
        for (const customCol of customColumns) {
            const customStory = customCol.stories?.find(story => story.id === storyId)
            if (customStory) return customStory
        }

        return null
    }

    const startEditingColumn = (columnId: string, currentTitle: string) => {
        setEditingColumnId(columnId)
        setEditingColumnTitle(currentTitle)
    }

    const saveColumnTitle = () => {
        if (!editingColumnId || !editingColumnTitle.trim()) return

        // Update custom columns if it's a custom column
        if (editingColumnId.startsWith('custom_')) {
            setCustomColumns(prev =>
                prev.map(col =>
                    col.id === editingColumnId
                        ? { ...col, title: editingColumnTitle.trim() }
                        : col
                )
            )
        }

        setEditingColumnId(null)
        setEditingColumnTitle('')
    }

    const cancelEditingColumn = () => {
        setEditingColumnId(null)
        setEditingColumnTitle('')
    }

    // ✅ ADD COLUMN FUNKTIONEN
    const handleAddColumn = () => {
        if (newColumnTitle.trim()) {
            const newColumn: CustomColumnData = {
                id: `custom_${Date.now()}`,
                title: newColumnTitle.trim(),
                stories: []
            }
            setCustomColumns(prev => [...prev, newColumn])
            setNewColumnTitle('')
            setShowAddColumn(false)
        }
    }

    const handleDeleteColumn = (columnId: string) => {
        // Remove the column
        const columnToDelete = customColumns.find(col => col.id === columnId)
        setCustomColumns(prev => prev.filter(col => col.id !== columnId))

        // Clean up tracker for stories that were in this column
        if (columnToDelete) {
            try {
                const customStoryTracker = getCustomStoryTracker()
                // Remove tracking for stories that were in the deleted column
                Object.keys(customStoryTracker).forEach(storyId => {
                    if (customStoryTracker[storyId] === columnId) {
                        delete customStoryTracker[storyId]
                    }
                })
                localStorage.setItem(`customStoryTracker_${currentBoardId}`, JSON.stringify(customStoryTracker))
            } catch (error) {
                console.error('Failed to clean up custom story tracker:', error)
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-gray-600">Loading stories...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error: {error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
            <div className="h-full flex flex-col p-6 min-h-0">
                <div className="text-center py-6 flex-shrink-0">
                    <div className="inline-flex items-center gap-4 mb-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight pt-1">Project Board</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Board ID: {currentBoardId}</p>
                    {columns.length > 3 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Scroll horizontally to see all columns
                        </p>
                    )}
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="w-full flex-1 min-h-0 overflow-x-auto overflow-y-hidden relative" ref={setScrollContainerRef}>
                        <div className="flex space-x-6 p-6 min-w-max h-full">
                            {columns.map((column) => {
                                const DroppableArea = ({ children }: { children: React.ReactNode }) => {
                                    const { setNodeRef, isOver } = useDroppable({
                                        id: column.id,
                                    })
                                    return (
                                        <div
                                            ref={setNodeRef}
                                            className={`
                                            space-y-4 flex-1 min-h-[200px] max-h-[350px] overflow-y-auto overflow-x-hidden scrollbar-thin board-column
                                            transition-all duration-200 ease-out rounded-xl p-3
                                            ${isOver ? 'bg-blue-50/80 dark:bg-blue-900/30 border-2 border-blue-400/50 dark:border-blue-500/50 backdrop-blur-sm' : 'bg-gray-50/30 dark:bg-gray-700/20'}
                                        `}
                                        >
                                            {children}
                                        </div>
                                    )
                                }

                                return (
                                    <div key={column.id} className="flex-shrink-0 w-80">
                                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 group h-[500px] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-2xl">
                                            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                                                {editingColumnId === column.id ? (
                                                    <div className="flex items-center space-x-2 flex-1">
                                                        <input
                                                            type="text"
                                                            value={editingColumnTitle}
                                                            onChange={(e) => setEditingColumnTitle(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveColumnTitle()
                                                                if (e.key === 'Escape') cancelEditingColumn()
                                                            }}
                                                            className="flex-1 px-3 py-2 text-sm font-semibold bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={saveColumnTitle}
                                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingColumn}
                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <h3 className="font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                                                            {column.title}
                                                        </h3>
                                                        <button
                                                            onClick={() => startEditingColumn(column.id, column.title)}
                                                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        {/* Delete button for custom columns */}
                                                        {column.id.startsWith('custom_') && (
                                                            <button
                                                                onClick={() => handleDeleteColumn(column.id)}
                                                                className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                title="Delete Column"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-xl shadow-sm">
                                                        {column.stories.length}
                                                    </span>
                                                </div>
                                            </div>

                                            <DroppableArea>
                                                <SortableContext
                                                    items={column.stories.map(story => story.id.toString())}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {column.stories.map((story) => (
                                                        <StoryCard
                                                            key={story.id}
                                                            story={story}
                                                            onClick={() => handleStoryClick(story)}
                                                        />
                                                    ))}
                                                </SortableContext>

                                                {column.stories.length > 5 && (
                                                    <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-500">
                                                        Scroll for more stories
                                                    </div>
                                                )}
                                            </DroppableArea>

                                            {showAddStoryForm === column.id ? (
                                                <AddStoryForm
                                                    onSubmit={handleCreateStory}
                                                    onCancel={() => setShowAddStoryForm(null)}
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setShowAddStoryForm(column.id)}
                                                    className="w-full mt-auto mb-0 p-4 border-2 border-dashed border-blue-300/50 dark:border-blue-600/50 rounded-xl text-blue-600 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex-shrink-0 flex items-center justify-center gap-2 font-medium backdrop-blur-sm"
                                                >
                                                    <Plus size={18} />
                                                    Add Story
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add Column */}
                            <div className="flex-shrink-0 w-80">
                                {showAddColumn ? (
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 h-[500px] transition-all duration-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <Plus className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                Add New Column
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Column Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Testing, Review, Archive..."
                                                    value={newColumnTitle}
                                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddColumn()
                                                        if (e.key === 'Escape') setShowAddColumn(false)
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={handleAddColumn}
                                                    disabled={!newColumnTitle.trim()}
                                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Create Column
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowAddColumn(false)
                                                        setNewColumnTitle('')
                                                    }}
                                                    className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 text-blue-500 mt-0.5">💡</div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                                        Pro Tip
                                                    </p>
                                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                                        Custom columns help organize your workflow. You can add stages like "Testing", "Code Review", or "Deployment".
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowAddColumn(true)}
                                        className="w-full h-[500px] border-2 border-dashed border-blue-300/50 dark:border-blue-600/50 rounded-2xl text-blue-600 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all duration-300 flex flex-col items-center justify-center gap-6 group backdrop-blur-sm"
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-dashed border-current rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <Plus size={32} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold mb-2">Add Column</div>
                                            <div className="text-sm opacity-80">Create a custom workflow stage</div>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <DragOverlay dropAnimation={{
                        duration: 300,
                        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                    }}>
                        {activeStory ? (
                            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 rotate-6 scale-110 opacity-90">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                                    {activeStory.title}
                                </h4>
                                <div className="flex justify-between items-center">
                                    <span className={`px-2 py-1 text-xs rounded-full ${activeStory.priority === StoryPriority.CRITICAL || activeStory.priority === StoryPriority.URGENT
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        : activeStory.priority === StoryPriority.HIGH
                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                            : activeStory.priority === StoryPriority.MEDIUM
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        }`}>
                                        {activeStory.priority}
                                    </span>
                                    {activeStory.story_points && (
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {activeStory.story_points} pts
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Story Detail Modal */}
                {selectedStory && (
                    <StoryDetailModal
                        story={selectedStory}
                        onClose={() => setSelectedStory(null)}
                        onEdit={async (storyId, updates) => {
                            const success = await updateStory(storyId, updates);
                            if (success) {
                                // Find the updated story and update selectedStory
                                const updatedStory = stories.find(s => s.id === storyId);
                                if (updatedStory) {
                                    setSelectedStory(updatedStory);
                                }
                            }
                        }}
                        onDelete={async (storyId) => {
                            const success = await deleteStory(storyId);
                            if (success) {
                                setSelectedStory(null);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    )
}
