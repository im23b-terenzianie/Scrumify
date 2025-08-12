import { useState } from 'react';
import { StoryPriority, type UserStoryCreate } from '../types/userStory';

type NewStoryData = Omit<UserStoryCreate, 'board_id'>;

interface AddStoryFormProps {
    onSubmit: (storyData: NewStoryData) => void;
    onCancel: () => void;
}

export default function AddStoryForm({ onSubmit, onCancel }: AddStoryFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [storyPoints, setStoryPoints] = useState<number | ''>('');
    const [priority, setPriority] = useState<StoryPriority>(StoryPriority.MEDIUM);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            return;
        }
        if (storyPoints === '' || storyPoints === 0) {
            return; // Simply return without showing alert
        }
        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            story_points: Number(storyPoints),
            priority,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add New Story
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <textarea
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter story title..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            rows={2}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optional)..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            rows={4}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Story Points (Fibonacci) *
                            </label>
                            <select
                                value={storyPoints}
                                onChange={(e) => setStoryPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                            >
                                <option value="">Select Points *</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                                <option value={8}>8</option>
                                <option value={13}>13</option>
                                <option value={21}>21</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value) as StoryPriority)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value={StoryPriority.LOW}>🟢 Low</option>
                                <option value={StoryPriority.MEDIUM}>🟡 Medium</option>
                                <option value={StoryPriority.HIGH}>🟠 High</option>
                                <option value={StoryPriority.URGENT}>🔴 Urgent</option>
                                <option value={StoryPriority.CRITICAL}>🚨 Critical</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                        >
                            Add Story
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
