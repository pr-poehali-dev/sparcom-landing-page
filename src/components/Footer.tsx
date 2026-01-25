import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">SPARCOM</h3>
            <p className="text-sm text-muted-foreground">
              Культура бани и осознанных встреч. Москва, 2026.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  Каталог встреч
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-muted-foreground hover:text-primary transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Для участников</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/apply-role" className="text-muted-foreground hover:text-primary transition-colors">
                  Стать организатором
                </Link>
              </li>
              <li>
                <Link to="/apply-role" className="text-muted-foreground hover:text-primary transition-colors">
                  Стать пармастером
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Правила сообщества
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-muted-foreground">
                <Icon name="Mail" size={16} className="mr-2" />
                hello@sparcom.ru
              </li>
              <li className="flex items-center text-muted-foreground">
                <Icon name="MapPin" size={16} className="mr-2" />
                Москва
              </li>
            </ul>
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} SPARCOM. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
