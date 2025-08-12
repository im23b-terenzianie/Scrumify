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
        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            story_points: storyPoints === '' ? undefined : Number(storyPoints),
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
                                Story Points
                            </label>
                            <input
                                type="number"
                                value={storyPoints}
                                onChange={(e) => setStoryPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                placeholder="Story Points"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority (Fibonacci)
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value) as StoryPriority)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value={StoryPriority.LOW}>🟢 Low (1)</option>
                                <option value={StoryPriority.MEDIUM}>🟡 Medium (2)</option>
                                <option value={StoryPriority.HIGH}>🟠 High (3)</option>
                                <option value={StoryPriority.URGENT}>🔴 Urgent (5)</option>
                                <option value={StoryPriority.CRITICAL}>🚨 Critical (8)</option>
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
