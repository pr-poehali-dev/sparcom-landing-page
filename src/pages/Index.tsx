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
                SPARCOM — культура бани и осознанных встреч
              </h1>
              
              <p className="text-xl md:text-2xl max-w-2xl leading-relaxed font-light opacity-95">
                Банный клуб и сообщество, где люди, пармастера и пространства соединяются вокруг здоровья, уважения и продуманного формата отдыха.
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
            <div className="space-y-8 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold">Что такое SPARCOM</h2>
              <p className="text-xl md:text-2xl text-foreground leading-relaxed">
                SPARCOM — это не поток гостей и не стихийные выезды.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Мы создаём <strong className="text-foreground">организованную систему банных встреч</strong>, где:
              </p>
            </div>

            <div className="space-y-6">
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={22} />
                  <span>группа формируется заранее</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={22} />
                  <span>формат согласован с баней и мастером</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={22} />
                  <span>правила и границы понятны всем</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={22} />
                  <span>ответственность лежит на одном организаторе</span>
                </li>
              </ul>
            </div>

            <div className="mt-16 p-10 md:p-12 bg-accent/5 rounded-2xl border-l-4 border-accent">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed">
                Мы берём на себя коммуникацию, записи и процесс,<br />
                чтобы баня оставалась пространством отдыха и восстановления.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Meetings Work */}
      <section id="meetings" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold">Как проходят встречи</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  number: "01",
                  icon: "UserCheck",
                  title: "Подготовленная группа",
                  description: "Во встречах участвуют люди, которые понимают формат бани и приходят осознанно — не «потусить»."
                },
                {
                  number: "02",
                  icon: "Home",
                  title: "Аренда бани в складчину",
                  description: "Стоимость аренды делится между участниками. Оплата собирается заранее, формат прозрачен и понятен."
                },
                {
                  number: "03",
                  icon: "Compass",
                  title: "Организатор SPARCOM",
                  description: "На каждой встрече есть представитель клуба — единая точка ответственности за людей, процесс и атмосферу."
                },
                {
                  number: "04",
                  icon: "Sparkles",
                  title: "Дополнительные практики — по желанию",
                  description: "Коллективные и индивидуальные парения, авторские ритуалы и форматы. Без навязывания и давления — участие всегда добровольное."
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
            <div className="space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold">Кто приходит в SPARCOM</h2>
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
                  <div className="space-y-4">
                    <p className="text-base text-muted-foreground leading-relaxed">Люди, которые:</p>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "ценят качество и тишину",
                      "уважают личные границы",
                      "не употребляют алкоголь",
                      "понимают ритуальный и оздоровительный формат бани",
                      "готовы платить за атмосферу и порядок"
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
                  <div className="space-y-4">
                    <p className="text-base text-muted-foreground leading-relaxed">Наши партнёры получают:</p>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "подготовленную аудиторию",
                      "предсказуемые группы",
                      "уважительное отношение к пространству и мастерству",
                      "минимальные риски отмен",
                      "долгосрочное сотрудничество"
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

            <div className="mt-16 p-10 md:p-12 bg-accent/5 rounded-2xl border-l-4 border-accent">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed">
                Это не массовый поток, а сообщество.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold">Правила и безопасность</h2>
              <p className="text-lg text-muted-foreground">
                Во всех форматах SPARCOM действуют единые правила:
              </p>
            </div>

            <ul className="space-y-5 mb-16">
              {[
                "строго без алкоголя",
                "уважение личных границ",
                "фото и видео — только с согласия",
                "участие добровольное",
                "можно выйти из процесса в любой момент"
              ].map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={22} />
                  <span className="text-lg text-muted-foreground">{rule}</span>
                </li>
              ))}
            </ul>
            <div className="mb-16 p-10 bg-accent/5 rounded-2xl border-l-4 border-accent">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Организатор имеет право отказать участнику и отвечает за атмосферу и безопасность встречи.
              </p>
            </div>

            <blockquote className="p-12 md:p-16 bg-accent/10 rounded-2xl text-center">
              <p className="text-3xl md:text-4xl font-semibold leading-relaxed text-foreground">
                Правила создают свободу, <span className="text-accent">а не ограничения.</span>
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 md:py-32 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-accent-foreground">
                SPARCOM — это не про количество.<br />
                Это про культуру, сообщество и систему.
              </p>
              <p className="text-xl md:text-2xl font-light opacity-90">
                Если вам близок такой подход — добро пожаловать.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" className="text-base font-semibold rounded-full px-8 bg-background text-foreground hover:bg-background/90">
                Посмотреть ближайшие встречи
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold rounded-full px-8 border-2 border-accent-foreground/30 hover:bg-accent-foreground/10">
                Познакомиться со SPARCOM
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