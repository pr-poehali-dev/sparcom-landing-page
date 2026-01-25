import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Icon from '@/components/ui/icon';
import AuthModal from '@/components/auth/AuthModal';

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://cdn.poehali.dev/projects/556d55ad-7e7d-414c-b3f6-1f25a5f56828/files/0e092e08-1188-469f-8b14-db215a883c3f.jpg" 
            alt="SPARCOM atmosphere" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/50"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
          <div className="max-w-4xl">
            <div className="space-y-8 animate-fade-in text-primary-foreground">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-5 py-2 bg-background/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  Москва — запуск 2026
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                SPARCOM — культура бани и осознанных встреч
              </h1>
              
              <p className="text-xl md:text-2xl max-w-2xl leading-relaxed font-light opacity-95">
                Банный клуб и сообщество, где люди, пармастера и пространства соединяются вокруг здоровья, уважения и продуманного формата отдыха.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="text-base font-semibold rounded-full px-8 bg-accent hover:bg-accent/90" 
                  onClick={() => navigate('/catalog')}
                >
                  Посмотреть встречи
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base font-semibold rounded-full px-8 border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground" 
                  onClick={() => scrollToSection("about")}
                >
                  Как мы работаем
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Что такое SPARCOM</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                SPARCOM — это новый формат банных встреч, где каждый элемент продуман: 
                от выбора пространства до сопровождения опытного пармастера. 
                Мы объединяем людей, которые ценят здоровье, культуру и осознанный отдых.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Простой путь к качественному банному опыту
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Search" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Выберите встречу</h3>
              <p className="text-muted-foreground">
                Каталог событий с баней, мастером и датой
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Calendar" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Забронируйте место</h3>
              <p className="text-muted-foreground">
                Оплатите онлайн и получите подтверждение
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Heart" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Наслаждайтесь</h3>
              <p className="text-muted-foreground">
                Приходите в назначенное время и отдыхайте
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Готовы присоединиться?
            </h2>
            <p className="text-xl opacity-90">
              Создайте аккаунт и найдите свою первую банную встречу
            </p>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-8"
              onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
            >
              Зарегистрироваться
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}