import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserService, type UpdateUserProfile } from '../services/userService';
import { User, Save, Lock, Trash2, Camera, AlertCircle } from 'lucide-react';

export default function UserProfile() {
    const { user, logout, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Profile Form State
    const [profileData, setProfileData] = useState<UpdateUserProfile>({
        username: user?.username || '',
        email: user?.email || '',
        full_name: user?.full_name || '',
        avatar_url: user?.avatar_url || '',
    });

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username,
                email: user.email,
                full_name: user.full_name || '',
                avatar_url: user.avatar_url || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await UserService.updateProfile(profileData);
            setSuccess('✅ Profile updated successfully!');

            // Refresh user data in AuthContext
            await refreshUser();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await UserService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            setSuccess('✅ Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        setError(null);

        try {
            await UserService.deleteAccount();
            logout(); // Log user out after account deletion
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete account');
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg animate-pulse"></div>
                        <div className="text-xl text-gray-600 dark:text-gray-300 font-medium">Loading profile...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-xl">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        User Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-green-200 dark:border-green-800 rounded-2xl p-4 shadow-lg">
                        <p className="text-green-800 dark:text-green-200 flex items-center gap-2">
                            <span className="text-xl">✅</span>
                            {success}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-200 hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-white" />
                                </div>
                                Profile Picture
                            </h2>
                            <div className="text-center">
                                <div className="mx-auto w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-200 hover:scale-105">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt="Profile"
                                            className="w-40 h-40 rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <User className="w-20 h-20 text-white" />
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        value={profileData.avatar_url}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                                        placeholder="Avatar URL (optional)"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Enter a URL to your profile picture
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-200 hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                Profile Information
                            </h2>

                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Username *
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Your full name (optional)"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-200 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        Security Settings
                    </h2>

                    <div className="space-y-6">
                        {!showPasswordForm ? (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Change Password
                            </button>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                        }}
                                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-white" />
                        </div>
                        Danger Zone
                    </h2>
                    <p className="text-red-700 dark:text-red-300 mb-6 text-lg">
                        Deleting your account is permanent and cannot be undone. All your data will be lost.
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Delete Account
                        </button>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 border border-red-300 dark:border-red-700">
                                <p className="text-red-800 dark:text-red-200 font-bold text-lg mb-2">
                                    ⚠️ Are you absolutely sure?
                                </p>
                                <p className="text-red-700 dark:text-red-300">
                                    This action cannot be undone. Your account and all associated data will be permanently deleted.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
