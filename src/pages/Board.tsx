import { useParams } from 'react-router-dom'

export default function Board() {
    const { projectId } = useParams()

    const columns = [
        {
            id: 'backlog',
            title: 'Backlog',
            stories: [
                { id: '1', title: 'User Registration', points: 5, priority: 'high' },
                { id: '2', title: 'Payment Integration', points: 8, priority: 'medium' },
            ]
        },
        {
            id: 'todo',
            title: 'To Do',
            stories: [
                { id: '3', title: 'Product Catalog', points: 3, priority: 'high' },
            ]
        },
        {
            id: 'in_progress',
            title: 'In Progress',
            stories: [
                { id: '4', title: 'User Authentication', points: 5, priority: 'high' },
            ]
        },
        {
            id: 'review',
            title: 'Review',
            stories: [
                { id: '5', title: 'Shopping Cart', points: 8, priority: 'medium' },
            ]
        },
        {
            id: 'done',
            title: 'Done',
            stories: [
                { id: '6', title: 'Project Setup', points: 2, priority: 'low' },
                { id: '7', title: 'Database Design', points: 5, priority: 'medium' },
            ]
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Board</h1>
                <p className="text-gray-600">Project ID: {projectId}</p>
            </div>

            <div className="flex space-x-6 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <div key={column.id} className="flex-shrink-0 w-80">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                                    {column.stories.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {column.stories.map((story) => (
                                    <div key={story.id} className="bg-white p-4 rounded-lg shadow-sm border">
                                        <h4 className="font-medium text-gray-900 mb-2">{story.title}</h4>
                                        <div className="flex justify-between items-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${story.priority === 'high'
                                                    ? 'bg-red-100 text-red-800'
                                                    : story.priority === 'medium'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                {story.priority}
                                            </span>
                                            <span className="text-sm font-medium text-blue-600">
                                                {story.points} pts
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600">
                                + Add Story
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
