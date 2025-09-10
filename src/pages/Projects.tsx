import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../services/api'
import type { Project } from '../types'

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [newProject, setNewProject] = useState({
        title: '',
        description: ''
    })

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            setIsLoading(true)
            setError('')
            const data = await apiClient.getBoards()
            setProjects(data)
        } catch (err: any) {
            console.error('❌ Failed to load projects:', err)
            setError(err.message || 'Failed to load projects')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newProject.title.trim()) return

        try {
            setIsCreating(true)
            const createdProject = await apiClient.createBoard(newProject)
            setProjects([...projects, createdProject])
            setNewProject({ title: '', description: '' })
            setShowCreateForm(false)
        } catch (err: any) {
            setError(err.message || 'Failed to create project')
        } finally {
            setIsCreating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 dark:text-gray-300">Loading projects...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your SCRUM projects</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                    <span className="text-lg">+</span>
                    New Project
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl flex items-center gap-3">
                    <div className="w-5 h-5 text-red-500">⚠️</div>
                    {error}
                </div>
            )}

            {showCreateForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New Project</h3>
                            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                    <input
                                        type="text"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {isCreating ? 'Creating...' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group transform hover:scale-[1.02]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
                            </div>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                                Active
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                            {project.description || 'No description available'}
                        </p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{project.members?.length || 0}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    members
                                </span>
                            </div>
                            <Link
                                to={`/app/projects/${project.id}/board`}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 group"
                            >
                                View Board
                                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl text-white">📋</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first project to get started with SCRUM management!</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Create Project
                    </button>
                </div>
            )}
        </div>
    )
}
