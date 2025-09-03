import { Calendar, Clock, Users, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"

export default function SchedulePage() {
  const currentDate = new Date()
  const currentWeek = getWeekDates(currentDate)

  const veterinarians = [
    { id: 1, name: "Др. Анна Петрова", specialty: "Хирург", color: "bg-blue-500" },
    { id: 2, name: "Др. Михаил Сидоров", specialty: "Терапевт", color: "bg-green-500" },
    { id: 3, name: "Др. Елена Козлова", specialty: "Дерматолог", color: "bg-purple-500" },
  ]

  const timeSlots = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`)

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
                        <Button variant="outline" size="sm">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Сегодня
                        </Button>
                        <Button variant="outline" size="sm">
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
                              {getAppointmentsForSlot(time, dayIndex).map((appointment, idx) => (
                                <div
                                  key={idx}
                                  className={`absolute inset-1 rounded text-xs p-1 text-white ${appointment.vetColor}`}
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
                  {veterinarians.map((vet) => (
                    <Card key={vet.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${vet.color}`}></div>
                          {vet.name}
                          <Badge variant="secondary">{vet.specialty}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-4">
                          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
                            <div key={day} className="space-y-2">
                              <div className="text-sm font-medium text-center">{day}</div>
                              <div className="space-y-1">
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
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground">+12% от вчера</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Средняя длительность</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45 мин</div>
                      <p className="text-xs text-muted-foreground">-3 мин от среднего</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Активные ветеринары</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3 из 3</div>
                      <p className="text-xs text-muted-foreground">Все на рабочих местах</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Загруженность по ветеринарам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {veterinarians.map((vet) => (
                        <div key={vet.id} className="flex items-center gap-4">
                          <div className="flex items-center gap-2 min-w-[200px]">
                            <div className={`w-3 h-3 rounded-full ${vet.color}`}></div>
                            <span className="font-medium">{vet.name}</span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${vet.color}`}
                              style={{ width: `${Math.random() * 40 + 60}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 min-w-[50px]">
                            {Math.floor(Math.random() * 40 + 60)}%
                          </span>
                        </div>
                      ))}
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

function getAppointmentsForSlot(time: string, dayIndex: number) {
  const appointments = [
    { patient: "Барсик", vet: "Др. Петрова", vetColor: "bg-blue-500" },
    { patient: "Мурка", vet: "Др. Сидоров", vetColor: "bg-green-500" },
    { patient: "Рекс", vet: "Др. Козлова", vetColor: "bg-purple-500" },
  ]

  if (Math.random() > 0.7) {
    return [appointments[Math.floor(Math.random() * appointments.length)]]
  }
  return []
}
