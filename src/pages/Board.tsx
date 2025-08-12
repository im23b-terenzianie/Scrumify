import { useState, useEffect } from 'react'
import type React from 'react'
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
}

export default function Board() {
    const { projectId } = useParams()
    const boardId = projectId ? parseInt(projectId) : 1 // Default board ID

    //  Kanban Hook f�r API-Integration
    const {
        stories,
        loading,
        error,
        createStory,
        updateStory,
        moveStory,
        deleteStory,
        getStoriesByStatus
    } = useKanban(boardId)

    // UI State
    const [activeStory, setActiveStory] = useState<UserStory | null>(null)
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
    const [editingColumnTitle, setEditingColumnTitle] = useState<string>('')
    const [showAddStoryForm, setShowAddStoryForm] = useState<StoryStatus | null>(null)
    const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
    const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null)
    const [customColumns, setCustomColumns] = useState<Column[]>([])
    const [showAddColumn, setShowAddColumn] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')

    //  Spalten mit Stories aus dem Backend + Custom Columns
    const columns: Column[] = [
        ...COLUMN_CONFIG.map(config => ({
            ...config,
            stories: getStoriesByStatus(config.status)
        })),
        ...customColumns
    ]

    //  NEUE STORY ERSTELLEN - Backend Guide kompatibel
    const handleCreateStory = async (storyData: Omit<UserStoryCreate, 'board_id'>) => {
        // Füge den Status der aktuellen Spalte hinzu
        const completeStoryData = {
            ...storyData,
            status: showAddStoryForm || StoryStatus.TODO,
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

        const activeStory = stories.find(s => s.id === activeStoryId)
        if (!activeStory) return

        const overColumn = COLUMN_CONFIG.find(col => col.id === overId)

        if (overColumn && activeStory.status !== overColumn.status) {
            await moveStory(activeStoryId, overColumn.status)
        }
    }

    const findStoryById = (id: string): UserStory | null => {
        return stories.find(story => story.id === parseInt(id)) || null
    }

    const startEditingColumn = (columnId: string, currentTitle: string) => {
        setEditingColumnId(columnId)
        setEditingColumnTitle(currentTitle)
    }

    const saveColumnTitle = () => {
        if (!editingColumnId || !editingColumnTitle.trim()) return
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
            const newColumn: Column = {
                id: `custom_${Date.now()}`,
                title: newColumnTitle.trim(),
                status: StoryStatus.TODO, // Default status for custom columns
                stories: []
            }
            setCustomColumns(prev => [...prev, newColumn])
            setNewColumnTitle('')
            setShowAddColumn(false)
        }
    }

    const handleDeleteColumn = (columnId: string) => {
        setCustomColumns(prev => prev.filter(col => col.id !== columnId))
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
        <div className="h-full flex flex-col p-6 min-h-0">
            <div className="text-center py-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Board</h1>
                <p className="text-gray-600 dark:text-gray-400">Project ID: {projectId}</p>
                {columns.length > 3 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                                            space-y-3 flex-1 min-h-[200px] max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin board-column
                                            transition-all duration-200 ease-out rounded-lg p-2
                                            ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600' : ''}
                                        `}
                                    >
                                        {children}
                                    </div>
                                )
                            }

                            return (
                                <div key={column.id} className="flex-shrink-0 w-80">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group h-[500px] flex flex-col overflow-hidden">
                                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
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
                                                        className="flex-1 px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={saveColumnTitle}
                                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
                                                    >

                                                    </button>
                                                    <button
                                                        onClick={cancelEditingColumn}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                                                    >

                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2 flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {column.title}
                                                    </h3>
                                                    <button
                                                        onClick={() => startEditingColumn(column.id, column.title)}
                                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    {/* Delete button for custom columns */}
                                                    {column.id.startsWith('custom_') && (
                                                        <button
                                                            onClick={() => handleDeleteColumn(column.id)}
                                                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Delete Column"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <span className="bg-gray-500 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
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

                                        {showAddStoryForm === column.status ? (
                                            <AddStoryForm
                                                onSubmit={handleCreateStory}
                                                onCancel={() => setShowAddStoryForm(null)}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => setShowAddStoryForm(column.status)}
                                                className="w-full mt-auto mb-0 p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
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
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 h-[500px] border-2 border-blue-200 dark:border-blue-700 shadow-lg backdrop-blur-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Plus className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                                    className="w-full h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                                >
                                    <div className="w-16 h-16 border-2 border-dashed border-current rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <Plus size={28} />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-medium mb-1">Add Column</div>
                                        <div className="text-sm opacity-70">Create a custom workflow stage</div>
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
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-2xl border dark:border-gray-700 rotate-6 scale-110 opacity-90">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
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
                        console.log('🔄 Updating story:', storyId, updates);
                        const success = await updateStory(storyId, updates);
                        if (success) {
                            // Find the updated story and update selectedStory
                            const updatedStory = stories.find(s => s.id === storyId);
                            if (updatedStory) {
                                console.log('✅ Story updated, refreshing modal:', updatedStory);
                                setSelectedStory(updatedStory);
                            }
                        }
                    }}
                    onDelete={async (storyId) => {
                        console.log('🗑️ Deleting story:', storyId);
                        const success = await deleteStory(storyId);
                        if (success) {
                            setSelectedStory(null);
                        }
                    }}
                />
            )}
        </div>
    )
}
