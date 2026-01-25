import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Icon from '@/components/ui/icon';
import { Event } from '@/types';

export default function CatalogPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/800287f6-75ba-4988-afab-d1a969efe552?action=list');
        
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка встреч...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Каталог встреч</h1>
            <p className="text-muted-foreground">
              Найдите подходящее банное событие и забронируйте место
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="search"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Icon name="Calendar" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Пока нет событий</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? 'По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос.'
                      : 'События скоро появятся. Следите за обновлениями!'}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Сбросить поиск
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'full' ? 'bg-red-100 text-red-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'published' && 'Открыта'}
                        {event.status === 'full' && 'Мест нет'}
                        {event.status === 'ongoing' && 'Идёт'}
                        {event.status === 'completed' && 'Завершена'}
                        {event.status === 'draft' && 'Черновик'}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      {formatDate(event.event_date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} className="mr-2" />
                      {event.duration_hours} {event.duration_hours === 1 ? 'час' : 'часа'}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Icon name="Users" size={16} className="mr-2" />
                      {event.current_participants} / {event.max_participants} участников
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold">
                          {event.price_per_person.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="text-sm text-muted-foreground">за человека</span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        disabled={event.status !== 'published' || event.current_participants >= event.max_participants}
                      >
                        {event.status === 'published' && event.current_participants < event.max_participants ? (
                          <>
                            Забронировать
                            <Icon name="ArrowRight" className="ml-2" size={16} />
                          </>
                        ) : event.status === 'full' || event.current_participants >= event.max_participants ? (
                          'Мест нет'
                        ) : (
                          'Недоступно'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}