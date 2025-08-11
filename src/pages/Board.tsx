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
    closestCorners,
    useDroppable,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import StoryCard from '../components/StoryCard'

type Story = {
    id: string
    title: string
    points: number
    priority: 'high' | 'medium' | 'low'
    columnId: string
}

type Column = {
    id: string
    title: string
    stories: Story[]
}

export default function Board() {
    const { projectId } = useParams()
    const [activeStory, setActiveStory] = useState<Story | null>(null)
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
    const [editingColumnTitle, setEditingColumnTitle] = useState<string>('')
    const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null)

    const [columns, setColumns] = useState<Column[]>([
        {
            id: 'backlog',
            title: 'Backlog',
            stories: [
                { id: '1', title: 'User Registration', points: 5, priority: 'high', columnId: 'backlog' },
                { id: '2', title: 'Payment Integration', points: 8, priority: 'medium', columnId: 'backlog' },
                { id: '8', title: 'Email Notifications', points: 3, priority: 'low', columnId: 'backlog' },
                { id: '9', title: 'User Profile Management', points: 5, priority: 'medium', columnId: 'backlog' },
                { id: '10', title: 'Search Functionality', points: 8, priority: 'high', columnId: 'backlog' },
                { id: '11', title: 'Data Export Feature', points: 4, priority: 'low', columnId: 'backlog' },
                { id: '12', title: 'API Documentation', points: 6, priority: 'medium', columnId: 'backlog' },
            ]
        },
        {
            id: 'todo',
            title: 'To Do',
            stories: [
                { id: '3', title: 'Product Catalog', points: 3, priority: 'high', columnId: 'todo' },
                { id: '13', title: 'Shopping Cart Implementation', points: 7, priority: 'high', columnId: 'todo' },
                { id: '14', title: 'Order Processing', points: 9, priority: 'high', columnId: 'todo' },
                { id: '15', title: 'Inventory Management', points: 6, priority: 'medium', columnId: 'todo' },
            ]
        },
        {
            id: 'in_progress',
            title: 'In Progress',
            stories: [
                { id: '4', title: 'User Authentication', points: 5, priority: 'high', columnId: 'in_progress' },
                { id: '16', title: 'Database Optimization', points: 8, priority: 'medium', columnId: 'in_progress' },
                { id: '17', title: 'Frontend Components', points: 4, priority: 'low', columnId: 'in_progress' },
            ]
        },
        {
            id: 'review',
            title: 'Review',
            stories: [
                { id: '5', title: 'Shopping Cart', points: 8, priority: 'medium', columnId: 'review' },
                { id: '18', title: 'Payment Gateway Integration', points: 10, priority: 'high', columnId: 'review' },
                { id: '19', title: 'User Interface Design', points: 6, priority: 'medium', columnId: 'review' },
                { id: '20', title: 'Testing Suite', points: 5, priority: 'low', columnId: 'review' },
            ]
        },
        {
            id: 'done',
            title: 'Done',
            stories: [
                { id: '6', title: 'Project Setup', points: 2, priority: 'low', columnId: 'done' },
                { id: '7', title: 'Database Design', points: 5, priority: 'medium', columnId: 'done' },
                { id: '21', title: 'Basic Routing', points: 3, priority: 'low', columnId: 'done' },
                { id: '22', title: 'Authentication Setup', points: 4, priority: 'medium', columnId: 'done' },
            ]
        },
    ])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    // Horizontal scroll functions
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

    // Keyboard navigation
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
        const story = findStoryById(active.id as string)
        setActiveStory(story)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveStory(null)

        if (!over) return

        const activeStoryId = active.id as string
        const overId = over.id as string

        // Find the active story and its current column
        const activeStory = findStoryById(activeStoryId)
        if (!activeStory) return

        const activeColumn = findColumnByStoryId(activeStoryId)
        const overColumn = findColumnById(overId) || findColumnByStoryId(overId)

        if (!activeColumn || !overColumn) return

        // If dropping in the same column, reorder
        if (activeColumn.id === overColumn.id) {
            const columnIndex = columns.findIndex(col => col.id === activeColumn.id)
            const activeIndex = activeColumn.stories.findIndex(story => story.id === activeStoryId)
            const overIndex = activeColumn.stories.findIndex(story => story.id === overId)

            if (activeIndex !== overIndex) {
                const newStories = [...activeColumn.stories]
                const [removed] = newStories.splice(activeIndex, 1)
                newStories.splice(overIndex, 0, removed)

                const newColumns = [...columns]
                newColumns[columnIndex] = {
                    ...activeColumn,
                    stories: newStories
                }
                setColumns(newColumns)
            }
        } else {
            // Moving to a different column
            moveStoryToColumn(activeStoryId, activeColumn.id, overColumn.id)
        }
    }

    const findStoryById = (id: string): Story | null => {
        for (const column of columns) {
            const story = column.stories.find(story => story.id === id)
            if (story) return story
        }
        return null
    }

    const findColumnById = (id: string): Column | null => {
        return columns.find(column => column.id === id) || null
    }

    const findColumnByStoryId = (storyId: string): Column | null => {
        for (const column of columns) {
            if (column.stories.some(story => story.id === storyId)) {
                return column
            }
        }
        return null
    }

    const moveStoryToColumn = (storyId: string, fromColumnId: string, toColumnId: string) => {
        const fromColumnIndex = columns.findIndex(col => col.id === fromColumnId)
        const toColumnIndex = columns.findIndex(col => col.id === toColumnId)

        if (fromColumnIndex === -1 || toColumnIndex === -1) return

        const fromColumn = columns[fromColumnIndex]
        const toColumn = columns[toColumnIndex]

        const storyIndex = fromColumn.stories.findIndex(story => story.id === storyId)
        if (storyIndex === -1) return

        const story = fromColumn.stories[storyIndex]
        const updatedStory = { ...story, columnId: toColumnId }

        const newFromStories = fromColumn.stories.filter(story => story.id !== storyId)
        const newToStories = [...toColumn.stories, updatedStory]

        const newColumns = [...columns]
        newColumns[fromColumnIndex] = { ...fromColumn, stories: newFromStories }
        newColumns[toColumnIndex] = { ...toColumn, stories: newToStories }

        setColumns(newColumns)
    }

    const addColumn = () => {
        const newColumnId = `column-${Date.now()}`
        const newColumn: Column = {
            id: newColumnId,
            title: 'New Column',
            stories: []
        }
        setColumns([...columns, newColumn])
    }

    const deleteColumn = (columnId: string) => {
        if (columns.length <= 1) return // Don't allow deleting the last column

        const columnToDelete = columns.find(col => col.id === columnId)
        if (!columnToDelete) return

        // If the column has stories, move them to the first remaining column
        if (columnToDelete.stories.length > 0) {
            const remainingColumns = columns.filter(col => col.id !== columnId)
            if (remainingColumns.length > 0) {
                const targetColumn = remainingColumns[0]
                const updatedStories = columnToDelete.stories.map(story => ({
                    ...story,
                    columnId: targetColumn.id
                }))

                const newColumns = columns.map(col => {
                    if (col.id === targetColumn.id) {
                        return { ...col, stories: [...col.stories, ...updatedStories] }
                    }
                    if (col.id === columnId) {
                        return null // This will be filtered out
                    }
                    return col
                }).filter(Boolean) as Column[]

                setColumns(newColumns)
                return
            }
        }

        // If no stories to move, just delete the column
        setColumns(columns.filter(col => col.id !== columnId))
    }

    const startEditingColumn = (columnId: string, currentTitle: string) => {
        setEditingColumnId(columnId)
        setEditingColumnTitle(currentTitle)
    }

    const saveColumnTitle = () => {
        if (!editingColumnId || !editingColumnTitle.trim()) return

        const newColumns = columns.map(col =>
            col.id === editingColumnId
                ? { ...col, title: editingColumnTitle.trim() }
                : col
        )
        setColumns(newColumns)
        setEditingColumnId(null)
        setEditingColumnTitle('')
    }

    const cancelEditingColumn = () => {
        setEditingColumnId(null)
        setEditingColumnTitle('')
    }

    return (
        <div className="h-full flex flex-col p-6 min-h-0">
            <div className="text-center py-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Board</h1>
                <p className="text-gray-600 dark:text-gray-400">Project ID: {projectId}</p>
                {columns.length > 3 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ← Scroll horizontally to see all columns →
                    </p>
                )}
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Horizontal scrolling container */}
                <div className="w-full flex-1 min-h-0 overflow-x-auto overflow-y-hidden relative" ref={setScrollContainerRef}>
                    {/* Scroll indicators */}
                    {columns.length > 3 && (
                        <>
                            <button
                                onClick={scrollLeft}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                title="Scroll left (or use ← arrow key)"
                            >
                                <div className="text-gray-600 dark:text-gray-400 text-sm">←</div>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                title="Scroll right (or use → arrow key)"
                            >
                                <div className="text-gray-600 dark:text-gray-400 text-sm">→</div>
                            </button>
                        </>
                    )}
                    
                    <div className="flex space-x-6 p-6 min-w-max h-full">
                        {columns.map((column) => {
                            const DroppableArea = ({ children }: { children: React.ReactNode }) => {
                                const { setNodeRef } = useDroppable({
                                    id: column.id,
                                })
                                return <div ref={setNodeRef} className="space-y-3 flex-1 min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin board-column">{children}</div>
                            }

                            return (
                                <div key={column.id} className="flex-shrink-0 w-80">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group h-[500px] flex flex-col">
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
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingColumn}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                                                    >
                                                        ✕
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
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <span className="bg-gray-500 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                                                    {column.stories.length}
                                                </span>
                                                {columns.length > 1 && (
                                                    <button
                                                        onClick={() => deleteColumn(column.id)}
                                                        className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <DroppableArea>
                                            <SortableContext
                                                items={column.stories.map(story => story.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {column.stories.map((story) => (
                                                    <StoryCard key={story.id} story={story} />
                                                ))}
                                            </SortableContext>
                                            
                                            {/* Scroll indicator when there are many stories */}
                                            {column.stories.length > 5 && (
                                                <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-500">
                                                    ↓ Scroll for more stories ↓
                                                </div>
                                            )}
                                        </DroppableArea>

                                        <button className="w-full mt-auto mb-0 p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0">
                                            + Add Story
                                        </button>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Add Column Button */}
                        <div className="flex-shrink-0 w-80">
                            <button
                                onClick={addColumn}
                                className="w-full h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Plus size={20} />
                                <span>Add Column</span>
                            </button>
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeStory ? (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border dark:border-gray-700 rotate-3 scale-105">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {activeStory.title}
                            </h4>
                            <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${activeStory.priority === 'high'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : activeStory.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                    {activeStory.priority}
                                </span>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {activeStory.points} pts
                                </span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}
