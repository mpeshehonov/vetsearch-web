"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"

interface VetData {
  id: string
  full_name: string
  specialization: string
  color: string
}

interface AppointmentData {
  id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: string
  reason: string
  pets: {
    name: string
  } | null
  profiles: {
    id: string
    full_name: string
  } | null
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [veterinarians, setVeterinarians] = useState<VetData[]>([])
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVet, setSelectedVet] = useState<string>("all")

  const currentWeek = getWeekDates(currentDate)
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`)

  const vetColors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-indigo-500"]

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        redirect("/auth/login")
      }

      // Получаем ветеринаров
      const { data: vets } = await supabase
        .from("profiles")
        .select("id, full_name, specialization")
        .eq("role", "veterinarian")
        .eq("is_active", true)

      if (vets) {
        const vetsWithColors = vets.map((vet, index) => ({
          ...vet,
          color: vetColors[index % vetColors.length]
        }))
        setVeterinarians(vetsWithColors)
      }

      // Получаем записи на месяц
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          duration_minutes,
          status,
          reason,
          pets (
            name
          ),
          profiles (
            id,
            full_name
          )
        `)
        .gte("appointment_date", startOfMonth.toISOString().split('T')[0])
        .lte("appointment_date", endOfMonth.toISOString().split('T')[0])

      if (appointmentsData) {
        setAppointments(appointmentsData as AppointmentData[])
      }

      setLoading(false)
    }

    fetchData()
  }, [currentDate])

  // Фильтрация записей по ветеринару
  const getFilteredAppointments = (vetId?: string) => {
    if (!vetId || vetId === "all") return appointments
    return appointments.filter(apt => apt.profiles?.id === vetId)
  }

  // Функция получения записей для слота времени
  const getAppointmentsForSlot = (time: string, dayIndex: number, vetId?: string) => {
    const dateStr = formatDateToday(currentWeek[dayIndex])
    const filteredAppointments = getFilteredAppointments(vetId)

    return filteredAppointments
      .filter(apt => apt.appointment_date === dateStr && apt.appointment_time.startsWith(time.slice(0, 2)))
      .map(apt => ({
        patient: apt.pets?.name || 'Неизвестно',
        vet: apt.profiles?.full_name || 'Неизвестно',
        vetColor: veterinarians.find(v => v.id === apt.profiles?.id)?.color || 'bg-gray-500',
        status: apt.status
      }))
  }

  const formatDateToday = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-8">Загрузка расписания...</div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Расписание ветеринаров</h1>
                <p className="text-gray-600 mt-1">Управление рабочим временем и загруженностью</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Заблокировать время
                </Button>
              </div>
            </div>

            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calendar">Календарь</TabsTrigger>
                <TabsTrigger value="worktime">Рабочее время</TabsTrigger>
                <TabsTrigger value="statistics">Статистика</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Недельное расписание
                        </CardTitle>
                        <CardDescription>
                          {currentWeek[0].toLocaleDateString("ru-RU")} - {currentWeek[6].toLocaleDateString("ru-RU")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={selectedVet} onValueChange={setSelectedVet}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Все ветеринары" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все ветеринары</SelectItem>
                            {veterinarians.map((vet) => (
                              <SelectItem key={vet.id} value={vet.id}>
                                {vet.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => {
                          const newDate = new Date(currentDate)
                          newDate.setDate(currentDate.getDate() - 7)
                          setCurrentDate(newDate)
                        }}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentDate(new Date())}
                        >
                          Сегодня
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          const newDate = new Date(currentDate)
                          newDate.setDate(currentDate.getDate() + 7)
                          setCurrentDate(newDate)
                        }}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-8 gap-2">
                      <div className="p-2"></div>
                      {currentWeek.map((date, index) => (
                        <div key={index} className="p-2 text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {date.toLocaleDateString("ru-RU", { weekday: "short" })}
                          </div>
                          <div className="text-lg font-bold text-gray-700">{date.getDate()}</div>
                        </div>
                      ))}

                      {timeSlots.map((time) => (
                        <div key={time} className="contents">
                          <div className="p-2 text-sm text-gray-600 font-medium border-r">{time}</div>
                          {currentWeek.map((_, dayIndex) => (
                            <div key={dayIndex} className="p-1 border border-gray-200 min-h-[60px] relative">
                              {getAppointmentsForSlot(time, dayIndex, selectedVet).map((appointment, idx) => (
                                <div
                                  key={idx}
                                  className={`absolute inset-1 rounded text-xs p-1 text-white ${appointment.vetColor} ${appointment.status === 'cancelled' ? 'opacity-50' : ''}`}
                                >
                                  <div className="font-medium truncate">{appointment.patient}</div>
                                  <div className="truncate opacity-90">{appointment.vet}</div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="worktime" className="space-y-6">
                <div className="grid gap-6">
                  {veterinarians.map((vet) => {
                    const vetAppointments = appointments.filter(apt => apt.profiles?.id === vet.id)
                    const todayAppts = vetAppointments.filter(apt =>
                      apt.appointment_date === formatDateToday(new Date())
                    )

                    return (
                      <Card key={vet.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${vet.color}`}></div>
                            {vet.full_name}
                            {vet.specialization && (
                              <Badge variant="secondary">{vet.specialization}</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Сегодня: {todayAppts.length} записей
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-7 gap-4">
                            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => {
                              const dayDate = new Date(currentWeek[index])
                              const dayAppointments = vetAppointments.filter(apt =>
                                apt.appointment_date === formatDateToday(dayDate)
                              )

                              return (
                                <div key={day} className="space-y-2">
                                  <div className="text-sm font-medium text-center">
                                    {day} ({dayDate.getDate()})
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-xs text-center text-gray-600">
                                      {dayAppointments.length} зап.
                                    </div>
                                    <Select defaultValue={index < 5 ? "9-18" : index === 5 ? "9-14" : "off"}>
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="off">Выходной</SelectItem>
                                        <SelectItem value="9-18">09:00 - 18:00</SelectItem>
                                        <SelectItem value="9-14">09:00 - 14:00</SelectItem>
                                        <SelectItem value="14-22">14:00 - 22:00</SelectItem>
                                        <SelectItem value="custom">Настроить</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Загруженность сегодня</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(() => {
                          const todayAppts = appointments.filter(apt =>
                            apt.appointment_date === formatDateToday(new Date())
                          )
                          const totalSlots = veterinarians.length * 10 // 10 часов работы
                          const loadPercent = totalSlots > 0 ? Math.round((todayAppts.length / totalSlots) * 100) : 0
                          return `${loadPercent}%`
                        })()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {appointments.filter(apt =>
                          apt.appointment_date === formatDateToday(new Date())
                        ).length} записей сегодня
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Средняя длительность</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.length > 0
                          ? Math.round(appointments.reduce((sum, apt) => sum + apt.duration_minutes, 0) / appointments.length)
                          : 0
                        } мин
                      </div>
                      <p className="text-xs text-muted-foreground">
                        По всем записям
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Активные ветеринары</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {veterinarians.length} из {veterinarians.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Все на рабочих местах
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Загруженность по ветеринарам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {veterinarians.map((vet) => {
                        const vetAppointments = appointments.filter(apt => apt.profiles?.id === vet.id)
                        const totalDuration = vetAppointments.reduce((sum, apt) => sum + apt.duration_minutes, 0)
                        const workHoursInMonth = 21 * 8 * 60 // 21 рабочий день, 8 часов, 60 мин
                        const loadPercent = workHoursInMonth > 0 ? Math.min(100, Math.round((totalDuration / workHoursInMonth) * 100)) : 0

                        return (
                          <div key={vet.id} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 min-w-[200px]">
                              <div className={`w-3 h-3 rounded-full ${vet.color}`}></div>
                              <span className="font-medium">{vet.full_name}</span>
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${vet.color}`}
                                style={{ width: `${loadPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 min-w-[50px]">
                              {loadPercent}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
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

function getWeekDates(date: Date) {
  const week = []
  const startOfWeek = new Date(date)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    week.push(day)
  }

  return week
}
