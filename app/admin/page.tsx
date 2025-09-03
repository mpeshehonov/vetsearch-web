import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Проверяем права администратора
  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Получаем статистику
  const { data: usersCount } = await supabase.from("profiles").select("id", { count: "exact" })
  const { data: petsCount } = await supabase.from("pets").select("id", { count: "exact" })
  const { data: appointmentsCount } = await supabase.from("appointments").select("id", { count: "exact" })
  const { data: servicesCount } = await supabase.from("services").select("id", { count: "exact" })

  // Получаем список пользователей
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Получаем список услуг
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  // Получаем недавние записи
  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select(`
      *,
      pets (
        name,
        species,
        pet_owners (
          full_name
        )
      ),
      profiles (
        full_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "veterinarian":
        return "Ветеринар"
      case "admin":
        return "Администратор"
      case "receptionist":
        return "Регистратор"
      default:
        return "Пользователь"
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700"
      case "veterinarian":
        return "bg-emerald-100 text-emerald-700"
      case "receptionist":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={profile?.role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile} onSignOut={handleSignOut} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Заголовок */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Панель администратора</h1>
              <p className="text-gray-600">Управление пользователями, услугами и настройками системы</p>
            </div>

            {/* Статистические карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197V9a3 3 0 00-6 0v2m0 0V9a3 3 0 016 0v2m0 0V7a2 2 0 012-2h2a2 2 0 012 2v2m0 0V9a3 3 0 00-6 0v2m0 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0V9a3 3 0 016 0v2"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usersCount?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Активных сотрудников</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Пациенты</CardTitle>
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{petsCount?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Зарегистрированных животных</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Записи</CardTitle>
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointmentsCount?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Всего записей на прием</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Услуги</CardTitle>
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servicesCount?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Доступных услуг</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Пользователи</TabsTrigger>
                <TabsTrigger value="services">Услуги</TabsTrigger>
                <TabsTrigger value="reports">Отчеты</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Управление пользователями</CardTitle>
                      <CardDescription>Добавление, редактирование и управление сотрудниками</CardDescription>
                    </div>
                    <Link href="/admin/users/new">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Добавить пользователя</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users?.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-700 font-medium">
                                {user.full_name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                              {user.specialization && (
                                <div className="text-sm text-gray-500">Специализация: {user.specialization}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                            <Badge variant={user.is_active ? "secondary" : "outline"}>
                              {user.is_active ? "Активен" : "Неактивен"}
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Редактировать
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Управление услугами</CardTitle>
                      <CardDescription>Добавление, редактирование и управление услугами клиники</CardDescription>
                    </div>
                    <Link href="/admin/services/new">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Добавить услугу</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {services?.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900">{service.name}</h3>
                              {service.category && (
                                <Badge variant="outline" className="text-xs">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                            {service.description && (
                              <div className="text-sm text-gray-600 mb-1">{service.description}</div>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Продолжительность: {service.duration_minutes} мин</span>
                              {service.price && <span>Цена: ₽{service.price}</span>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={service.is_active ? "secondary" : "outline"}>
                              {service.is_active ? "Активна" : "Неактивна"}
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Редактировать
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Недавние записи</CardTitle>
                      <CardDescription>Последние 5 записей на прием</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentAppointments?.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between text-sm">
                            <div>
                              <div className="font-medium">
                                {appointment.pets?.name} ({appointment.pets?.species})
                              </div>
                              <div className="text-gray-600">Владелец: {appointment.pets?.pet_owners?.full_name}</div>
                              <div className="text-gray-500">Врач: {appointment.profiles?.full_name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {new Date(appointment.appointment_date).toLocaleDateString("ru-RU")}
                              </div>
                              <div className="text-gray-500">{appointment.appointment_time.slice(0, 5)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Статистика по услугам</CardTitle>
                      <CardDescription>Популярные услуги клиники</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {services?.slice(0, 5).map((service) => (
                          <div key={service.id} className="flex items-center justify-between text-sm">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-gray-600">{service.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₽{service.price || 0}</div>
                              <div className="text-gray-500">{service.duration_minutes} мин</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки клиники</CardTitle>
                      <CardDescription>Основные настройки системы</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Рабочие часы</div>
                          <div className="text-sm text-gray-600">Настройка времени работы клиники</div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Настроить
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Уведомления</div>
                          <div className="text-sm text-gray-600">Email и SMS уведомления</div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Настроить
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Резервное копирование</div>
                          <div className="text-sm text-gray-600">Автоматическое создание резервных копий</div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Настроить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Системная информация</CardTitle>
                      <CardDescription>Информация о системе и версии</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Версия системы:</span>
                        <span className="font-medium">1.0.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Последнее обновление:</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">База данных:</span>
                        <span className="font-medium">PostgreSQL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Статус системы:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Работает
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
