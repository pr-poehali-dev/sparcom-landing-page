import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Icon from '@/components/ui/icon';
import AuthModal from './auth/AuthModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthModalOpen(false);
  };

  return (
    <>
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className={`text-2xl font-bold transition-colors ${
                isScrolled ? 'text-primary' : 'text-primary-foreground'
              }`}>
                SPARCOM
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/catalog" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                Каталог встреч
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                О проекте
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Button 
                  variant={isScrolled ? "default" : "secondary"}
                  onClick={() => navigate('/account')}
                  className="rounded-full"
                >
                  <Icon name="User" className="mr-2" size={16} />
                  Кабинет
                </Button>
              ) : (
                <>
                  <Button 
                    variant={isScrolled ? "ghost" : "secondary"}
                    onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                    className="rounded-full"
                  >
                    Вход
                  </Button>
                  <Button 
                    variant={isScrolled ? "default" : "secondary"}
                    onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                    className="rounded-full"
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}