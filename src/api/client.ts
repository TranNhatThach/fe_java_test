import { useAuthStore } from '../store/authStore';
import { getCookie } from '../utils/cookie';

// Use Vite environment variable for base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}


/**
 * Robust fetch-based API client
 * Handles: Base URL, JSON parsing, Token from cookies, 401 redirect
 * Named export to fix "No matching export" errors
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { logout } = useAuthStore.getState();
  const { params, ...init } = options;

  // 1. Construct URL with query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;

  }

  // 2. Prepare headers
  const headers = new Headers(init.headers);
  
  // Get token from cookies or store (preference to cookie as requested)
  const token = getCookie('accessToken') || useAuthStore.getState().token;
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. Perform fetch
  try {
    const response = await fetch(url, {
      ...init,
      headers,
    });

    // 4. Handle 401 Unauthorized
    if (response.status === 401) {
      console.warn('Unauthorized access detected. Logging out...');
      logout();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
      throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // 5. Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Đã xảy ra lỗi không xác định.' }));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    // 6. Return parsed JSON (handle empty responses)
    if (response.status === 204) return {} as T;
    return await response.json();
    
  } catch (error: any) {
    // Global error logging
    console.error(`API Call failed: [${init.method || 'GET'}] ${endpoint}`, error);
    throw error;
  }
}
