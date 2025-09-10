import { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Save, XCircle } from 'lucide-react';
import { StoryPriority, type UserStory, type UserStoryUpdate } from '../types/userStory';

interface StoryDetailModalProps {
    story: UserStory;
    onClose: () => void;
    onEdit?: (storyId: number, updates: UserStoryUpdate) => Promise<void>;
    onDelete?: (storyId: number) => Promise<void>;
}

const getPriorityLabel = (priority: StoryPriority): string => {
    switch (priority) {
        case StoryPriority.LOW:
            return "🟢 Low";
        case StoryPriority.MEDIUM:
            return "🟡 Medium";
        case StoryPriority.HIGH:
            return "🟠 High";
        case StoryPriority.URGENT:
            return "🔴 Urgent";
        case StoryPriority.CRITICAL:
            return "🚨 Critical";
        default:
            return "🟡 Medium";
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

export default function StoryDetailModal({ story, onClose, onEdit, onDelete }: StoryDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editData, setEditData] = useState({
        title: story.title,
        description: story.description || '',
        story_points: story.story_points || 1,
        priority: story.priority
    });

    // ✅ Update edit data when story prop changes
    useEffect(() => {
        setEditData({
            title: story.title,
            description: story.description || '',
            story_points: story.story_points || 1,
            priority: story.priority
        });
    }, [story]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSave = async () => {
        if (!onEdit) return;

        try {
            await onEdit(story.id, {
                title: editData.title.trim(),
                description: editData.description.trim() || undefined,
                story_points: editData.story_points,
                priority: editData.priority
            });
            setIsEditing(false);
            // ✅ Modal bleibt offen, damit user das Ergebnis sieht
        } catch (error) {
            // Silent error handling
        }
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) return;

        try {
            await onDelete(story.id);
            onClose();
        } catch (error) {
            // Silent error handling
        }
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
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
                        {isEditing ? 'Edit Story' : 'Story Details'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                    title="Save changes"
                                >
                                    <Save size={20} />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                    title="Cancel editing"
                                >
                                    <XCircle size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                {onEdit && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                        title="Edit story"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={confirmDelete}
                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                        title="Delete story"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Delete Story
                                </h4>
                                <p className="text-sm text-red-600 dark:text-red-300">
                                    Are you sure you want to delete "{story.title}"? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Title
                        </h3>
                        {isEditing ? (
                            <textarea
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                rows={2}
                                required
                            />
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                {story.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Description
                        </h3>
                        {isEditing ? (
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                rows={4}
                                placeholder="Enter description..."
                            />
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md min-h-[100px]">
                                {story.description || "No description provided."}
                            </p>
                        )}
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
                                {isEditing ? (
                                    <select
                                        value={editData.priority}
                                        onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) as StoryPriority })}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    >
                                        <option value={StoryPriority.LOW}>🟢 Low</option>
                                        <option value={StoryPriority.MEDIUM}>🟡 Medium</option>
                                        <option value={StoryPriority.HIGH}>🟠 High</option>
                                        <option value={StoryPriority.URGENT}>🔴 Urgent</option>
                                        <option value={StoryPriority.CRITICAL}>🚨 Critical</option>
                                    </select>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {getPriorityLabel(story.priority)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Story Points & Assignee */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Story Points (Fibonacci)
                                </h4>
                                {isEditing ? (
                                    <select
                                        value={editData.story_points}
                                        onChange={(e) => setEditData({ ...editData, story_points: parseInt(e.target.value) })}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        required
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={5}>5</option>
                                        <option value={8}>8</option>
                                        <option value={13}>13</option>
                                        <option value={21}>21</option>
                                    </select>
                                ) : (
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {story.story_points ? `${story.story_points} pts` : "Not estimated"}
                                    </span>
                                )}
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
