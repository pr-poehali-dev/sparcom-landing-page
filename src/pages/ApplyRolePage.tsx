import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Icon from '@/components/ui/icon';

export default function ApplyRolePage() {
  const [requestedRole, setRequestedRole] = useState<'organizer' | 'master'>('organizer');
  const [motivation, setMotivation] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/1b896bdf-9cd0-426f-b064-6e71baf86194?action=apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requested_role: requestedRole,
          motivation,
          portfolio_url: portfolioUrl || null
        })
      });

      if (response.ok) {
        alert('Заявка отправлена! Мы рассмотрим её в течение 2-3 дней.');
        navigate('/account');
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/account')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад
          </Button>
          <h1 className="text-4xl font-bold mb-2">Заявка на новую роль</h1>
          <p className="text-muted-foreground">
            Расскажите о себе и своих планах в SPARCOM
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Выберите роль</CardTitle>
            <CardDescription>
              Организатор или пармастер — каждый вносит свой вклад в сообщество
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup value={requestedRole} onValueChange={(val) => setRequestedRole(val as 'organizer' | 'master')}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="organizer" id="organizer" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="organizer" className="text-base font-semibold cursor-pointer">
                      Организатор событий
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Создавайте банные встречи, выбирайте пространства и мастеров, 
                      собирайте группы единомышленников
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="master" id="master" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="master" className="text-base font-semibold cursor-pointer">
                      Пармастер
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Проводите банные процедуры, делитесь опытом и знаниями о культуре парения
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div>
                <Label htmlFor="motivation">
                  Мотивация <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="motivation"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Почему вы хотите стать организатором/мастером? Какой у вас опыт?"
                  className="mt-1 min-h-[150px]"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Расскажите о своём опыте, планах и том, что вы можете дать сообществу
                </p>
              </div>

              <div>
                <Label htmlFor="portfolio">Ссылка на портфолио / соцсети</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://instagram.com/username или https://..."
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Необязательно, но поможет нам узнать вас лучше
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Icon name="Info" size={18} className="mr-2" />
                  Что будет дальше?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Заявка поступит на рассмотрение администраторам</li>
                  <li>• Мы изучим вашу мотивацию и опыт (2-3 дня)</li>
                  <li>• Вы получите ответ на email</li>
                  <li>• При одобрении роль активируется автоматически</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !motivation.trim()}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                    Отправка...
                  </>
                ) : (
                  <>
                    Отправить заявку
                    <Icon name="Send" className="ml-2" size={16} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}