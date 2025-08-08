import { useDroppable } from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import StoryCard from './StoryCard'

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

interface DroppableColumnProps {
    column: Column
}

export default function DroppableColumn({ column }: DroppableColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    })

    return (
        <div className="flex-shrink-0 w-80">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {column.title}
                    </h3>
                    <span className="bg-gray-500 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                        {column.stories.length}
                    </span>
                </div>

                <div
                    ref={setNodeRef}
                    className="space-y-3 min-h-[200px]"
                >
                    <SortableContext
                        items={column.stories.map(story => story.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {column.stories.map((story) => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </SortableContext>
                </div>

                <button className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    + Add Story
                </button>
            </div>
        </div>
    )
}
