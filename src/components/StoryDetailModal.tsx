import { X } from 'lucide-react';
import { StoryPriority, type UserStory } from '../types/userStory';

interface StoryDetailModalProps {
    story: UserStory;
    onClose: () => void;
}

const getPriorityLabel = (priority: StoryPriority): string => {
    switch (priority) {
        case StoryPriority.LOW:
            return "🟢 Low (1)";
        case StoryPriority.MEDIUM:
            return "🟡 Medium (2)";
        case StoryPriority.HIGH:
            return "🟠 High (3)";
        case StoryPriority.URGENT:
            return "🔴 Urgent (5)";
        case StoryPriority.CRITICAL:
            return "🚨 Critical (8)";
        default:
            return "🟡 Medium (2)";
    }
};

const getStatusLabel = (status: string): string => {
    switch (status) {
        case "todo":
            return "📝 To Do";
        case "in_progress":
            return "⚡ In Progress";
        case "in_review":
            return "👀 In Review";
        case "done":
            return "✅ Done";
        default:
            return status;
    }
};

export default function StoryDetailModal({ story, onClose }: StoryDetailModalProps) {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Story Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Title
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            {story.title}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Description
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md min-h-[100px]">
                            {story.description || "No description provided."}
                        </p>
                    </div>

                    {/* Meta Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status & Priority */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Status
                                </h4>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {getStatusLabel(story.status)}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Priority
                                </h4>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    {getPriorityLabel(story.priority)}
                                </span>
                            </div>
                        </div>

                        {/* Story Points & Assignee */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Story Points
                                </h4>
                                <span className="text-gray-900 dark:text-white">
                                    {story.story_points ? `${story.story_points} pts` : "Not estimated"}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Assignee
                                </h4>
                                <span className="text-gray-900 dark:text-white">
                                    {story.assignee ? story.assignee.username : "Unassigned"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Story Format */}
                    {(story.user_type || story.user_action || story.user_benefit) && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                User Story Format
                            </h3>
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    <span className="font-medium">As a</span> {story.user_type || "user"}
                                    <br />
                                    <span className="font-medium">I want to</span> {story.user_action || "perform an action"}
                                    <br />
                                    <span className="font-medium">So that</span> {story.user_benefit || "I get some benefit"}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Acceptance Criteria */}
                    {story.acceptance_criteria && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Acceptance Criteria
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {story.acceptance_criteria}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Created
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {new Date(story.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Last Updated
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {new Date(story.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
