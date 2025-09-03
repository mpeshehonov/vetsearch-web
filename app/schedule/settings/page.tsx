import { ArrowLeft, Clock, Calendar, Bell, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import Link from "next/link"

export default function ScheduleSettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/schedule">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Настройки расписания</h1>
                <p className="text-gray-600 mt-1">Конфигурация рабочего времени и уведомлений</p>
              </div>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Общие настройки времени
                  </CardTitle>
                  <CardDescription>Базовые параметры рабочего времени клиники</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Начало рабочего дня</Label>
                      <Input id="start-time" type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Конец рабочего дня</Label>
                      <Input id="end-time" type="time" defaultValue="18:00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slot-duration">Длительность приема</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 минут</SelectItem>
                          <SelectItem value="30">30 минут</SelectItem>
                          <SelectItem value="45">45 минут</SelectItem>
                          <SelectItem value="60">60 минут</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break-duration">Перерыв между приемами</Label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Без перерыва</SelectItem>
                          <SelectItem value="5">5 минут</SelectItem>
                          <SelectItem value="10">10 минут</SelectItem>
                          <SelectItem value="15">15 минут</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Рабочие дни
                  </CardTitle>
                  <CardDescription>Настройка рабочих дней недели</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].map(
                      (day, index) => (
                        <div key={day} className="flex items-center justify-between">
                          <Label htmlFor={`day-${index}`} className="text-sm font-medium">
                            {day}
                          </Label>
                          <Switch id={`day-${index}`} defaultChecked={index < 6} />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Уведомления
                  </CardTitle>
                  <CardDescription>Настройка автоматических уведомлений</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Напоминания о записях</Label>
                      <p className="text-sm text-gray-600">Отправлять SMS владельцам за день до приема</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Уведомления ветеринарам</Label>
                      <p className="text-sm text-gray-600">Уведомлять о новых записях в расписании</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Отчеты по загруженности</Label>
                      <p className="text-sm text-gray-600">Еженедельные отчеты администратору</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Автоматическое распределение
                  </CardTitle>
                  <CardDescription>Настройки автоматического назначения ветеринаров</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Автоназначение ветеринара</Label>
                      <p className="text-sm text-gray-600">Автоматически назначать наименее загруженного ветеринара</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auto-rules">Правила автоназначения</Label>
                    <Textarea
                      id="auto-rules"
                      placeholder="Например: Хирургические операции - только Др. Петрова, Дерматология - Др. Козлова"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Отменить</Button>
                <Button>Сохранить настройки</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
