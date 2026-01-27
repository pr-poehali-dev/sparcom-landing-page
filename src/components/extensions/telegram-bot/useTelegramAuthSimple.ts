import { useState } from 'react';

const TELEGRAM_AUTH_URL = 'https://functions.poehali.dev/82269cf9-ee57-4db5-8914-f5a7a93ee669';
const TELEGRAM_BOT_USERNAME = 'SparcomAuth_bot';

interface User {
  id: number;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  telegram_id: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export function useTelegramAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openTelegramBot = () => {
    const botUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=web_auth`;
    window.open(botUrl, '_blank');
  };

  const exchangeToken = async (token: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${TELEGRAM_AUTH_URL}?action=callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка авторизации');
      }

      const data: AuthResponse = await response.json();
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка сети';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token');
  };

  return {
    openTelegramBot,
    exchangeToken,
    logout,
    getUser,
    isAuthenticated,
    isLoading,
    error,
  };
}
