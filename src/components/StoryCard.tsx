import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { StoryPriority, type UserStory } from '../types/userStory'

interface StoryCardProps {
    story: UserStory
    onClick?: () => void
}

const getPriorityColor = (priority: StoryPriority) => {
    switch (priority) {
        case StoryPriority.CRITICAL:  // 5
            return 'bg-red-600 text-white dark:bg-red-700'
        case StoryPriority.URGENT:    // 4
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        case StoryPriority.HIGH:      // 3
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        case StoryPriority.MEDIUM:    // 2
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        case StoryPriority.LOW:       // 1
        default:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
}

const getPriorityLabel = (priority: StoryPriority): string => {
    switch (priority) {
        case StoryPriority.CRITICAL:
            return "🚨 Critical";
        case StoryPriority.URGENT:
            return "🔴 Urgent";
        case StoryPriority.HIGH:
            return "🟠 High";
        case StoryPriority.MEDIUM:
            return "🟡 Medium";
        case StoryPriority.LOW:
        default:
            return "🟢 Low";
    }
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: story.id.toString() })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleClick = (e: React.MouseEvent) => {
        // Nur klicken wenn nicht gedraggt wird
        if (!isDragging && onClick) {
            e.stopPropagation();
            onClick();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={`
                bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
                dark:border-gray-700 cursor-pointer hover:shadow-md 
                transition-all duration-200 hover:scale-[1.02]
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {story.title}
            </h4>

            {story.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {story.description}
                </p>
            )}

            <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(story.priority)}`}>
                    {getPriorityLabel(story.priority)}
                </span>
                {story.story_points && (
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {story.story_points} pts
                    </span>
                )}
            </div>

            {story.assignee && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Assigned to: {story.assignee.username}
                </div>
            )}
        </div>
    )
}
