import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTelegramAuth } from '@/components/extensions/telegram-bot/useTelegramAuthSimple';
import { Loader2 } from 'lucide-react';

const TelegramCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeToken } = useTelegramAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setError('Токен авторизации не найден');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    exchangeToken(token)
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/account'), 1500);
      })
      .catch((err) => {
        setStatus('error');
        setError(err.message || 'Ошибка авторизации');
        setTimeout(() => navigate('/'), 3000);
      });
  }, [searchParams, exchangeToken, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg">Авторизация через Telegram...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-lg text-green-600">Успешная авторизация!</p>
            <p className="text-sm text-muted-foreground">Перенаправление...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">✕</span>
            </div>
            <p className="text-lg text-red-600">Ошибка авторизации</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TelegramCallbackPage;