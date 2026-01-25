import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
  setMode?: (mode: 'login' | 'register') => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, mode: externalMode, setMode: externalSetMode, onSuccess }: AuthModalProps) {
  const [internalMode, setInternalMode] = useState<'login' | 'register'>('login');
  
  const mode = externalMode !== undefined ? externalMode : internalMode;
  const setMode = externalSetMode !== undefined ? externalSetMode : setInternalMode;

  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else if (mode === 'register') {
      setMode('login');
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent/10 rounded-full transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">
              {mode === 'login' ? 'Вход в SPARCOM' : 'Регистрация в SPARCOM'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' 
                ? 'Добро пожаловать обратно' 
                : 'Присоединяйтесь к сообществу'}
            </p>
          </div>

          {mode === 'login' ? (
            <LoginForm 
              onSuccess={handleSuccess} 
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleSuccess} 
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </Card>
    </div>
  );
}