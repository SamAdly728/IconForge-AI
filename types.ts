// Global variable declarations injected by the environment
declare global {
  interface Window {
    __app_id?: string;
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
}

export interface IconGenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  imageUrl: string | null;
  error: string | null;
}

export interface UserState {
  uid: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
}
