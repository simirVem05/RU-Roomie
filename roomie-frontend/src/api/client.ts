// src/api/client.ts
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

// Create the axios instance
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Helper to attach the token dynamically
export function useApi() {
  const { getToken } = useAuth();

  // Wrap api so each call grabs a fresh token
  const withAuth = async (config: any) => {
    const token = await getToken({ template: 'mobile' }); // you create "mobile" in Clerk dashboard
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  };

  return {
    get: async (url: string, config = {}) =>
      api.get(url, await withAuth(config)),
    post: async (url: string, data = {}, config = {}) =>
      api.post(url, data, await withAuth(config)),
    put: async (url: string, data = {}, config = {}) =>
      api.put(url, data, await withAuth(config)),
    delete: async (url: string, config = {}) =>
      api.delete(url, await withAuth(config)),
  };
}
