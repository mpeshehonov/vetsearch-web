import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Получаем записи на прием с информацией о пациентах, владельцах и ветеринарах
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      pets (
        id,
        name,
        species,
        pet_owners (
          id,
          full_name,
          phone
        )
      ),
      profiles (
        id,
        full_name,
        specialization
      ),
      services (
        id,
        name,
        price
      )
    `)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })

  // Получаем записи на сегодня
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments?.filter((apt) => apt.appointment_date === today) || []

  // Получаем записи на завтра
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().split("T")[0]
  const tomorrowAppointments = appointments?.filter((apt) => apt.appointment_date === tomorrowDate) || []

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Запланирован", variant: "secondary" as const, color: "bg-blue-100 text-blue-700" },
      confirmed: { label: "Подтвержден", variant: "secondary" as const, color: "bg-green-100 text-green-700" },
      in_progress: { label: "В процессе", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-700" },
      completed: { label: "Завершен", variant: "secondary" as const, color: "bg-emerald-100 text-emerald-700" },
      cancelled: { label: "Отменен", variant: "secondary" as const, color: "bg-red-100 text-red-700" },
      no_show: { label: "Не явился", variant: "secondary" as const, color: "bg-gray-100 text-gray-700" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Убираем секунды
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      weekday: "short",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={profile?.role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile} onSignOut={handleSignOut} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Заголовок и действия */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Записи на прием</h1>
                <p className="text-gray-600">Управление расписанием и записями пациентов</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/appointments/calendar">
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    Календарь
                  </Button>
                </Link>
                <Link href="/appointments/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Новая запись</Button>
                </Link>
              </div>
            </div>

            <Tabs defaultValue="today" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="today">Сегодня ({todayAppointments.length})</TabsTrigger>
                <TabsTrigger value="tomorrow">Завтра ({tomorrowAppointments.length})</TabsTrigger>
                <TabsTrigger value="week">Неделя</TabsTrigger>
                <TabsTrigger value="all">Все записи</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <svg
                        className="w-5 h-5 text-emerald-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Записи на сегодня
                    </CardTitle>
                    <CardDescription>
                      {formatDate(today)} • {todayAppointments.length} записей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {todayAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">
                                  {formatTime(appointment.appointment_time)}
                                </div>
                                <div className="text-sm text-gray-500">{appointment.duration_minutes} мин</div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{appointment.pets?.name}</h3>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{appointment.pets?.species}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Владелец: {appointment.pets?.pet_owners?.full_name}
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Врач: {appointment.profiles?.full_name}
                                  {appointment.profiles?.specialization && ` (${appointment.profiles.specialization})`}
                                </div>
                                <div className="text-sm text-gray-500">Причина: {appointment.reason}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(appointment.status)}
                              <div className="flex space-x-2">
                                <Link href={`/appointments/${appointment.id}`}>
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    Подробнее
                                  </Button>
                                </Link>
                                {appointment.status === "scheduled" && (
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                    Начать прием
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Записей на сегодня нет</h3>
                        <p className="text-gray-600 mb-4">Создайте новую запись для пациента</p>
                        <Link href="/appointments/new">
                          <Button className="bg-emerald-600 hover:bg-emerald-700">Новая запись</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tomorrow" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Записи на завтра
                    </CardTitle>
                    <CardDescription>
                      {formatDate(tomorrowDate)} • {tomorrowAppointments.length} записей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tomorrowAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {tomorrowAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">
                                  {formatTime(appointment.appointment_time)}
                                </div>
                                <div className="text-sm text-gray-500">{appointment.duration_minutes} мин</div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{appointment.pets?.name}</h3>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{appointment.pets?.species}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Владелец: {appointment.pets?.pet_owners?.full_name}
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Врач: {appointment.profiles?.full_name}
                                </div>
                                <div className="text-sm text-gray-500">Причина: {appointment.reason}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(appointment.status)}
                              <Link href={`/appointments/${appointment.id}`}>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  Подробнее
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Записей на завтра нет</h3>
                        <p className="text-gray-600">Расписание на завтра свободно</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="week" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Записи на неделю</CardTitle>
                    <CardDescription>Обзор записей на ближайшие 7 дней</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-600">
                        Календарный вид записей на неделю будет добавлен в следующем обновлении
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Все записи</CardTitle>
                    <CardDescription>Полный список всех записей на прием</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments && appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatDate(appointment.appointment_date)}
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {formatTime(appointment.appointment_time)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{appointment.pets?.name}</h3>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{appointment.pets?.species}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Владелец: {appointment.pets?.pet_owners?.full_name}
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Врач: {appointment.profiles?.full_name}
                                </div>
                                <div className="text-sm text-gray-500">Причина: {appointment.reason}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(appointment.status)}
                              <Link href={`/appointments/${appointment.id}`}>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  Подробнее
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Записей не найдено</h3>
                        <p className="text-gray-600 mb-4">Создайте первую запись на прием</p>
                        <Link href="/appointments/new">
                          <Button className="bg-emerald-600 hover:bg-emerald-700">Новая запись</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
