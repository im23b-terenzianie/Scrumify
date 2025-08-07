interface ChatMessage {
    id: string
    text: string
    isOwn: boolean
    timestamp: string
    author?: string
}

interface ChatDemoProps {
    messages: ChatMessage[]
}

export function ChatDemo({ messages }: ChatDemoProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-md space-y-3">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Chat Preview</h3>

            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${message.isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                    >
                        {!message.isOwn && (
                            <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                                {message.author}
                            </div>
                        )}
                        <div className="text-sm">{message.text}</div>
                        <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                            {message.timestamp}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex mt-4">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white flex-1 px-3 py-2 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors">
                    Send
                </button>
            </div>
        </div>
    )
}

// Example usage component
export default function ColorShowcase() {
    const demoMessages: ChatMessage[] = [
        {
            id: '1',
            text: 'Hey team! Ready for our sprint planning?',
            isOwn: false,
            author: 'Sarah',
            timestamp: '10:30'
        },
        {
            id: '2',
            text: 'Absolutely! I\'ve prepared the user stories.',
            isOwn: true,
            timestamp: '10:32'
        },
        {
            id: '3',
            text: 'Great! Let\'s review them together.',
            isOwn: false,
            author: 'Mike',
            timestamp: '10:33'
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    🎨 Scrumify Color Palette Demo
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Your custom colors in action - perfect for chat and collaboration features!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChatDemo messages={demoMessages} />

                <div className="space-y-4">
                    <h3 className="text-gray-900 dark:text-white font-semibold">Color Examples</h3>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span className="text-green-500">Online Status</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="text-red-500">Error/Warning</span>
                        </div>

                        <div className="bg-purple-600 text-white px-3 py-2 rounded-md text-center">
                            Accent Button
                        </div>

                        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                            <span className="text-gray-900 dark:text-white">Your message style</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
