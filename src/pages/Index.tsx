import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-bold tracking-wide">SPARCOM</div>
            <div className="hidden md:flex space-x-10">
              <button onClick={() => scrollToSection("about")} className="text-sm font-medium hover:text-accent transition-all duration-200">О нас</button>
              <button onClick={() => scrollToSection("meetings")} className="text-sm font-medium hover:text-accent transition-all duration-200">Встречи</button>
              <button onClick={() => scrollToSection("community")} className="text-sm font-medium hover:text-accent transition-all duration-200">Сообщество</button>
              <button onClick={() => scrollToSection("rules")} className="text-sm font-medium hover:text-accent transition-all duration-200">Правила</button>
              <button onClick={() => scrollToSection("contact")} className="text-sm font-medium hover:text-accent transition-all duration-200">Контакты</button>
            </div>
            <Button size="sm" className="hidden md:flex rounded-full px-6">Вступить</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                Культура бани.<br />
                <span className="text-secondary">Без компромиссов.</span>
              </h1>
              
              <p className="text-xl md:text-2xl max-w-2xl leading-relaxed font-light opacity-95">
                Организованная система банных встреч для осознанных гостей. 
                Уважение, здоровье и качество — без алкоголя и хаоса.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="text-base font-semibold rounded-full px-8 bg-accent hover:bg-accent/90" onClick={() => scrollToSection("meetings")}>
                  Посмотреть встречи
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" className="text-base font-semibold rounded-full px-8 border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground" onClick={() => scrollToSection("about")}>
                  Как мы работаем
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is SPARCOM */}
      <section id="about" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Что такое SPARCOM</h2>
              <p className="text-xl text-muted-foreground">
                Отстройка от «обычных бань» и случайных ивентов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-10 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200 group">
                <div className="w-16 h-16 bg-accent/15 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-all">
                  <Icon name="Users" className="text-accent" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Не поток</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Ограниченное количество подготовленных гостей. Качество важнее количества.
                </p>
              </Card>

              <Card className="p-10 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200 group">
                <div className="w-16 h-16 bg-accent/15 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-all">
                  <Icon name="Shield" className="text-accent" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Не аренда</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Организованная встреча с единой точкой ответственности, а не «сам по себе».
                </p>
              </Card>

              <Card className="p-10 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200 group">
                <div className="w-16 h-16 bg-accent/15 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-all">
                  <Icon name="Heart" className="text-accent" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Не случайность</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Культурное сообщество людей, разделяющих ценности уважения и осознанности.
                </p>
              </Card>
            </div>

            <div className="mt-20 p-12 md:p-16 bg-accent/10 rounded-2xl">
              <blockquote className="text-3xl md:text-4xl font-semibold text-center leading-relaxed text-foreground">
                Мы берём на себя организацию, правила и людей — 
                <span className="text-accent"> чтобы баня оставалась баней.</span>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* How Meetings Work */}
      <section id="meetings" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Как проходят встречи</h2>
              <p className="text-xl text-muted-foreground">
                Предсказуемость, структура, уважение
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  number: "01",
                  icon: "UserCheck",
                  title: "Подготовленная группа",
                  description: "Каждый гость проходит знакомство с форматом и правилами. Мы знаем, кто приходит."
                },
                {
                  number: "02",
                  icon: "Home",
                  title: "Качественное пространство",
                  description: "Аренда проверенных банных комплексов в складчину. Комфорт и безопасность гарантированы."
                },
                {
                  number: "03",
                  icon: "Compass",
                  title: "Организатор SPARCOM",
                  description: "Единая точка ответственности за процесс, атмосферу и соблюдение правил."
                },
                {
                  number: "04",
                  icon: "Sparkles",
                  title: "Дополнительные практики",
                  description: "Парение, медитации, дыхательные практики — по желанию, без навязывания."
                }
              ].map((step, index) => (
                <Card 
                  key={index} 
                  className="p-8 md:p-10 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="text-7xl font-bold text-accent/15 leading-none">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-grow space-y-4">
                      <h3 className="text-2xl font-semibold">{step.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Кто с нами</h2>
              <p className="text-xl text-muted-foreground">
                Сообщество единомышленников и профессионалов
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-10 md:p-12 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent/15 rounded-xl flex items-center justify-center">
                      <Icon name="Users" className="text-accent" size={32} />
                    </div>
                    <h3 className="text-2xl font-semibold">Гости SPARCOM</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Осознанные взрослые 30-55 лет",
                      "Ценят качество и безопасность",
                      "Уважают личные границы",
                      "Не ищут случайные тусовки",
                      "Готовы следовать правилам"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={20} />
                        <span className="text-muted-foreground text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card className="p-10 md:p-12 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent/15 rounded-xl flex items-center justify-center">
                      <Icon name="Star" className="text-accent" size={32} />
                    </div>
                    <h3 className="text-2xl font-semibold">Пармастера и бани</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Партнёры с опытом и репутацией",
                      "Проверенные банные пространства",
                      "Единые стандарты качества",
                      "Предсказуемый сервис",
                      "Долгосрочное сотрудничество"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={20} />
                        <span className="text-muted-foreground text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-muted-foreground italic">
                Уважение, повторяемость, предсказуемость — отсутствие хаоса
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Правила и безопасность</h2>
              <p className="text-xl text-muted-foreground">
                Четкие границы создают свободу
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-16">
              {[
                {
                  icon: "Ban",
                  title: "Без алкоголя",
                  description: "Баня — это про здоровье и осознанность, не про опьянение"
                },
                {
                  icon: "Heart",
                  title: "Уважение границ",
                  description: "Личное пространство каждого гостя священно"
                },
                {
                  icon: "Camera",
                  title: "Согласие на медиа",
                  description: "Фото и видео только с разрешения всех участников"
                },
                {
                  icon: "ShieldCheck",
                  title: "Право отказаться",
                  description: "Никто не обязан участвовать в процедурах или практиках"
                }
              ].map((rule, index) => (
                <Card key={index} className="p-8 rounded-xl border-0 bg-card hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={rule.icon as any} className="text-accent" size={26} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{rule.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{rule.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-12 md:p-16 bg-accent/10 rounded-2xl">
              <blockquote className="text-3xl md:text-4xl font-semibold text-center leading-relaxed text-foreground">
                Правила создают свободу, 
                <span className="text-accent"> а не ограничения.</span>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 md:py-32 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Готовы к культурному опыту?
            </h2>
            <p className="text-xl md:text-2xl font-light opacity-95">
              Присоединяйтесь к сообществу осознанных гостей SPARCOM
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-base font-semibold rounded-full px-8 bg-background text-foreground hover:bg-background/90">
                Посмотреть ближайшие встречи
                <Icon name="Calendar" className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold rounded-full px-8 border-2 border-accent-foreground/30 hover:bg-accent-foreground/10">
                Познакомиться со SPARCOM
                <Icon name="MessageCircle" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-semibold tracking-wide">SPARCOM</div>
            <div className="flex gap-10 text-sm font-medium">
              <button className="hover:text-accent transition-all duration-200">Telegram</button>
              <button className="hover:text-accent transition-all duration-200">Instagram</button>
              <button className="hover:text-accent transition-all duration-200">WhatsApp</button>
            </div>
            <p className="text-sm text-muted-foreground font-light">© 2026 SPARCOM. Москва.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;