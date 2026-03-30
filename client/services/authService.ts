import api from './api';
import { ApiResponse, User } from '@/types';

interface AuthPayload {
  user: User;
  token: string;
}

export const authService = {
  async signup(name: string, email: string, password: string): Promise<AuthPayload> {
    const { data } = await api.post<ApiResponse<AuthPayload>>('/auth/signup', {
      name,
      email,
      password,
    });
    if (!data.success || !data.data) throw new Error(data.message || 'Signup failed');
    return data.data;
  },

  async login(email: string, password: string): Promise<AuthPayload> {
    const { data } = await api.post<ApiResponse & { token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    if (!data.success) throw new Error(data.message || 'Login failed');
    return { token: data.token, user: data.user };
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse & { user: User }>('/auth/me');
    if (!data.success) throw new Error(data.message || 'Failed to fetch user');
    return data.user;
  },
};
