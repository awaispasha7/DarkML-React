import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.226.252.253:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    // Note: We don't redirect on 401 here - let components handle it with dummy data
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Only redirect to login if we're not in dev mode and it's a real auth error
        // Otherwise, let components handle errors and use dummy data
        if (error.response?.status === 401 && !import.meta.env.DEV) {
          const token = localStorage.getItem('access_token');
          if (!token) {
            // No token at all - might want to redirect
            // But for now, let components handle it
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    // Try the API endpoint first
    try {
      const response = await this.api.post<AuthResponse>('/users/login/', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // If API fails, try OAuth2 style endpoint as fallback
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await this.api.post<AuthResponse>('/auth/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  // Generic API methods with error handling
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.api.get<T>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.api.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint);
    return response.data;
  }

  // Helper method to safely call API and return null on error
  async safeGet<T>(endpoint: string): Promise<T | null> {
    try {
      return await this.get<T>(endpoint);
    } catch (error) {
      console.warn(`API call failed for ${endpoint}:`, error);
      return null;
    }
  }
}

export const apiService = new ApiService();

