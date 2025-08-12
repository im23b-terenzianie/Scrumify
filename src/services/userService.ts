// services/userService.ts
import { API_CONFIG } from '../api/config';
import { authService } from './auth';
import type { User } from '../types';

export interface UpdateUserProfile {
    username?: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
}

export class UserService {
    private static readonly API_BASE = `${API_CONFIG.BASE_URL}/api/v1/users`;

    private static async apiCall(endpoint: string, options: RequestInit = {}) {
        const token = authService.getToken();
        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        const response = await fetch(`${this.API_BASE}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('🚨 User API Error Response:', errorText);

            try {
                const errorData = JSON.parse(errorText);
                console.error('🚨 Parsed Error Data:', errorData);
                throw new Error(JSON.stringify(errorData, null, 2));
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        }

        if (response.status === 204) return null;
        return await response.json();
    }

    // ✅ CURRENT USER PROFILE LADEN
    static async getCurrentUser(): Promise<User> {
        return await this.apiCall('/me');
    }

    // ✅ USER PROFILE AKTUALISIEREN
    static async updateProfile(profileData: UpdateUserProfile): Promise<User> {
        console.log('📤 Updating user profile:', profileData);

        return await this.apiCall('/me', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    // ✅ PASSWORT ÄNDERN
    static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        console.log('🔒 Changing user password');

        await this.apiCall('/me/password', {
            method: 'PUT',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
            }),
        });
    }

    // ✅ USER PROFILE LÖSCHEN (ACCOUNT DELETION)
    static async deleteAccount(): Promise<void> {
        console.log('🗑️ Deleting user account');

        await this.apiCall('/me', {
            method: 'DELETE',
        });
    }

    // ✅ ALLE USERS LADEN (für Assignments)
    static async getAllUsers(): Promise<User[]> {
        return await this.apiCall('');
    }
}
