import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Story = {
    id: string
    title: string
    points: number
    priority: 'high' | 'medium' | 'low'
    columnId: string
}

interface StoryCardProps {
    story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: story.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
                dark:border-gray-700 cursor-pointer hover:shadow-md 
                transition-shadow
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {story.title}
            </h4>
            <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${story.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : story.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                    {story.priority}
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {story.points} pts
                </span>
            </div>
        </div>
    )
}
