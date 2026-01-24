const AUTH_API_URL = 'https://functions.poehali.dev/ca41cd2e-d6e4-4b60-bdc9-7c9613cca01e';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'guest' | 'organizer' | 'master';
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  phone?: string;
  bio?: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
  user_id?: number;
}

class AuthAPI {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('sparcom_token');
  }

  private async request(action: string, method: string, body?: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${AUTH_API_URL}?action=${action}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Произошла ошибка');
    }

    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request('register', 'POST', data);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request('login', 'POST', data);
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('sparcom_token', response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.request('logout', 'POST');
    this.token = null;
    localStorage.removeItem('sparcom_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request('me', 'GET');
    return response.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authAPI = new AuthAPI();
