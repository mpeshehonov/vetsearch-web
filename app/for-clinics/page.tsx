"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Calendar, Star, TrendingUp, Shield, Clock, Phone, Mail, CheckCircle, BarChart3 } from "lucide-react"

const CatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.9 2 10 2.9 10 4C10 4.74 10.4 5.39 11 5.73V7H8C6.9 7 6 7.9 6 9V11C6 12.1 6.9 13 8 13H11V15.27C10.4 15.61 10 16.26 10 17C10 18.1 10.9 19 12 19S14 18.1 14 17C14 16.26 13.6 15.61 13 15.27V13H16C17.1 13 18 12.1 18 11V9C18 7.9 17.1 7 16 7H13V5.73C13.6 5.39 14 4.74 14 4C14 2.9 13.1 2 12 2M8.5 9.5C8.78 9.5 9 9.72 9 10S8.78 10.5 8.5 10.5 8 10.28 8 10 8.22 9.5 8.5 9.5M15.5 9.5C15.78 9.5 16 9.72 16 10S15.78 10.5 15.5 10.5 15 10.28 15 10 15.22 9.5 15.5 9.5M12 11.5C11.17 11.5 10.5 10.83 10.5 10S11.17 8.5 12 8.5 13.5 9.17 13.5 10 12.83 11.5 12 11.5Z" />
  </svg>
)

export default function ForClinicsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                <CatIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">ВетПоиск</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Главная
              </Link>
              <a href="#advantages" className="text-muted-foreground hover:text-primary transition-colors">
                Преимущества
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Тарифы
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="bg-transparent">
                  Войти
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Присоединиться</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-card via-muted/30 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Привлекайте больше
            <span className="text-primary block">клиентов онлайн</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-pretty">
            Разместите свою ветеринарную клинику на ВетПоиск и получайте записи от новых клиентов каждый день.
            Управляйте репутацией, расписанием и отзывами в одном месте.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6">
              Разместить клинику бесплатно
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Посмотреть демо
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Клиник уже с нами</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">15000+</div>
              <div className="text-sm text-muted-foreground">Записей в месяц</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Городов России</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Средний рейтинг</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Почему клиники выбирают ВетПоиск?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы помогаем ветеринарным клиникам расти и развиваться в цифровую эпоху
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Больше клиентов</CardTitle>
                <CardDescription>
                  Привлекайте новых клиентов через поиск. В среднем клиники получают +40% записей
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Онлайн-запись</CardTitle>
                <CardDescription>
                  Клиенты записываются сами 24/7. Освободите администраторов от рутинных звонков
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-chart-3" />
                </div>
                <CardTitle>Управление репутацией</CardTitle>
                <CardDescription>
                  Собирайте отзывы, отвечайте на них и повышайте доверие к вашей клинике
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-chart-1" />
                </div>
                <CardTitle>Аналитика и отчеты</CardTitle>
                <CardDescription>
                  Отслеживайте количество просмотров, звонков и записей. Принимайте решения на основе данных
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-chart-2" />
                </div>
                <CardTitle>Проверенный статус</CardTitle>
                <CardDescription>
                  Получите значок "Проверено" и повысьте доверие клиентов к вашей клинике
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-chart-4" />
                </div>
                <CardTitle>Рост бизнеса</CardTitle>
                <CardDescription>
                  Увеличьте узнаваемость бренда и привлекайте клиентов из соседних районов
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Тарифные планы</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите подходящий тариф для вашей клиники
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Базовый тариф */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Базовый</CardTitle>
                <div className="text-3xl font-bold text-primary">Бесплатно</div>
                <CardDescription>Для начинающих клиник</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Размещение в каталоге</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>До 5 фотографий</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Контактная информация</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Отзывы клиентов</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Начать бесплатно
                </Button>
              </CardContent>
            </Card>

            {/* Стандартный тариф */}
            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Популярный</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Стандартный</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  2 990 ₽<span className="text-lg font-normal">/мес</span>
                </div>
                <CardDescription>Для активно развивающихся клиник</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Все из тарифа "Базовый"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Онлайн-запись на прием</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Приоритет в поиске</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Базовая аналитика</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Управление расписанием</span>
                  </li>
                </ul>
                <Button className="w-full">Выбрать тариф</Button>
              </CardContent>
            </Card>

            {/* Премиум тариф */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Премиум</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  4 990 ₽<span className="text-lg font-normal">/мес</span>
                </div>
                <CardDescription>Для крупных клиник и сетей</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Все из тарифа "Стандартный"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Значок "Проверено"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Расширенная аналитика</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Персональный менеджер</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Реклама в топе поиска</span>
                  </li>
                </ul>
                <Button className="w-full">Выбрать тариф</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы привлечь больше клиентов?</h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к ВетПоиск уже сегодня и начните получать записи от новых клиентов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Разместить клинику бесплатно
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Связаться с нами
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Свяжитесь с нами</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Остались вопросы? Мы поможем вам начать работу с ВетПоиск
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Контактная информация</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Телефон</div>
                    <div className="text-muted-foreground">+7 (495) 123-45-67</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">clinics@vetpoisk.ru</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Время работы</div>
                    <div className="text-muted-foreground">Пн-Пт: 9:00-18:00</div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Оставьте заявку</CardTitle>
                <CardDescription>Мы свяжемся с вами в течение рабочего дня</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Input placeholder="Название клиники" />
                  </div>
                  <div>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div>
                    <Input type="tel" placeholder="Телефон" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Email" />
                  </div>
                  <Button className="w-full">Отправить заявку</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <CatIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">ВетПоиск</h3>
              </Link>
              <p className="text-muted-foreground mb-4">
                Платформа для поиска лучших ветеринарных клиник и врачей в вашем городе.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Для клиник</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#advantages" className="hover:text-primary transition-colors">
                    Преимущества
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary transition-colors">
                    Тарифы
                  </a>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-primary transition-colors">
                    Регистрация
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Поддержка</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#contact" className="hover:text-primary transition-colors">
                    Контакты
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Помощь
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ВетПоиск. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
