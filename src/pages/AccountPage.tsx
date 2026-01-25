import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from '@/components/ui/icon';
import { User } from '@/types';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('https://functions.poehali.dev/ca41cd2e-d6e4-4b60-bdc9-7c9613cca01e?action=me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setPhone(data.user.profile?.phone || '');
          setBio(data.user.profile?.bio || '');
        } else {
          localStorage.removeItem('auth_token');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch('https://functions.poehali.dev/ca41cd2e-d6e4-4b60-bdc9-7c9613cca01e?action=update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, bio })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert('Профиль обновлён');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">Управляйте своим профилем и бронированиями</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Ваши личные данные</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Имя пользователя</Label>
                <Input value={user.username} disabled className="mt-1" />
              </div>
              
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled className="mt-1" />
              </div>

              <div>
                <Label>Роль</Label>
                <div className="mt-1 px-3 py-2 bg-muted rounded-md font-medium">
                  {user.profile?.role === 'participant' && 'Участник (блогер)'}
                  {user.profile?.role === 'organizer' && 'Организатор'}
                  {user.profile?.role === 'master' && 'Пармастер'}
                  {user.profile?.role === 'bathowner' && 'Владелец бани'}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input 
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">О себе</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажите о себе..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <Button onClick={handleUpdateProfile} className="w-full">
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Мои бронирования</CardTitle>
                <CardDescription>Предстоящие события</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Calendar" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>У вас пока нет бронирований</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/catalog')}
                  >
                    Найти встречу
                  </Button>
                </div>
              </CardContent>
            </Card>

            {user.profile?.role === 'participant' && (
              <Card>
                <CardHeader>
                  <CardTitle>Расширьте возможности</CardTitle>
                  <CardDescription>Подайте заявку на новую роль</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md text-sm">
                    <p className="text-muted-foreground">
                      🎓 <strong>Участник</strong> — вы можете писать в блог и бронировать встречи
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Станьте <strong>организатором</strong>, <strong>пармастером</strong> или <strong>владельцем бани</strong>
                  </p>
                  <Button 
                    onClick={() => navigate('/apply-role')}
                    className="w-full"
                  >
                    Подать заявку
                    <Icon name="ArrowRight" className="ml-2" size={16} />
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Выход</CardTitle>
                <CardDescription>Завершить сеанс</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  <Icon name="LogOut" className="mr-2" size={16} />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}