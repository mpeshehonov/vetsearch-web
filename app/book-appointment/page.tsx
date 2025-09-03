"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { CalendarDays, Clock, MapPin, Phone, User, Heart, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  city_name: string
}

interface Veterinarian {
  id: string
  full_name: string
  specialization: string
}

interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookAppointmentPage() {
  const searchParams = useSearchParams()
  const clinicId = searchParams.get("clinic")
  const [step, setStep] = useState(1)
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)

  // Form data
  const [selectedVet, setSelectedVet] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [ownerData, setOwnerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
  })
  const [reason, setReason] = useState("")

  const supabase = createClient()

  // Available time slots (simplified - in real app would check actual availability)
  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "12:00", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!clinicId) return

      try {
        // Fetch clinic
        const { data: clinicData, error: clinicError } = await supabase
          .from("clinics")
          .select("id, name, address, phone, city_name")
          .eq("id", clinicId)
          .single()

        if (clinicError) throw clinicError
        setClinic(clinicData)

        // Fetch veterinarians
        const { data: vetsData, error: vetsError } = await supabase
          .from("profiles")
          .select("id, full_name, specialization")
          .eq("clinic_id", clinicId)
          .eq("role", "veterinarian")
          .eq("is_active", true)

        if (vetsError) throw vetsError
        setVeterinarians(vetsData || [])

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("id, name, price, duration_minutes")
          .eq("clinic_id", clinicId)
          .eq("is_active", true)
          .order("name")

        if (servicesError) throw servicesError
        setServices(servicesData || [])
      } catch (error) {
        console.error("Ошибка загрузки данных:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clinicId, supabase])

  const handleSubmit = async () => {
    if (!clinic || !selectedVet || !selectedService || !selectedDate || !selectedTime) return

    setSubmitting(true)
    try {
      // Create or find pet owner
      const { data: ownerData_db, error: ownerError } = await supabase
        .from("pet_owners")
        .upsert({
          full_name: ownerData.fullName,
          email: ownerData.email,
          phone: ownerData.phone,
          address: ownerData.address,
        })
        .select()
        .single()

      if (ownerError) throw ownerError

      // Create pet
      const { data: petData_db, error: petError } = await supabase
        .from("pets")
        .insert({
          owner_id: ownerData_db.id,
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          gender: petData.gender,
          weight: petData.weight ? Number.parseFloat(petData.weight) : null,
          birth_date: null, // Could calculate from age
        })
        .select()
        .single()

      if (petError) throw petError

      // Create appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          pet_id: petData_db.id,
          veterinarian_id: selectedVet,
          service_id: selectedService,
          appointment_date: selectedDate.toISOString().split("T")[0],
          appointment_time: selectedTime,
          duration_minutes: services.find((s) => s.id === selectedService)?.duration_minutes || 60,
          reason: reason,
          status: "scheduled",
        })
        .select()
        .single()

      if (appointmentError) throw appointmentError

      setAppointmentId(appointmentData.id)
      setStep(4) // Success step
    } catch (error) {
      console.error("Ошибка создания записи:", error)
      alert("Произошла ошибка при создании записи. Попробуйте еще раз.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Клиника не найдена</h1>
          <Link href="/">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Запись успешно создана!</CardTitle>
            <CardDescription>Ваша запись на прием подтверждена</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Номер записи</p>
              <p className="font-mono text-lg">{appointmentId?.slice(-8).toUpperCase()}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Мы свяжемся с вами по указанному телефону для подтверждения записи.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button className="w-full">Вернуться к поиску</Button>
              </Link>
              <Link href={`/clinic/${clinic.id}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  Вернуться к клинике
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/clinic/${clinic.id}`}
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к клинике
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Запись на прием</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {clinic.name}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {clinic.phone}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Шаг {step} из 3</div>
              <div className="w-32 bg-muted rounded-full h-2 mt-1">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Выберите врача и услугу</CardTitle>
                  <CardDescription>Укажите специалиста и тип процедуры</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Ветеринар</Label>
                    <Select value={selectedVet} onValueChange={setSelectedVet}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите врача" />
                      </SelectTrigger>
                      <SelectContent>
                        {veterinarians.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            <div>
                              <div className="font-medium">{vet.full_name}</div>
                              <div className="text-sm text-muted-foreground">{vet.specialization}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Услуга</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.name}</span>
                              <span className="text-sm text-muted-foreground ml-4">
                                {service.price.toLocaleString()} ₽
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Причина обращения</Label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Опишите проблему или цель визита..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={() => setStep(2)} disabled={!selectedVet || !selectedService} className="w-full">
                    Далее: Выбор даты и времени
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Выберите дату и время</CardTitle>
                  <CardDescription>Укажите удобное время для посещения</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-4 block">Дата приема</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                      className="rounded-md border"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <Label className="mb-4 block">Время приема</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className="bg-transparent"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                      Назад
                    </Button>
                    <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime} className="flex-1">
                      Далее: Данные пациента
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Данные пациента</CardTitle>
                  <CardDescription>Информация о владельце и питомце</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Данные владельца</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Полное имя *</Label>
                        <Input
                          value={ownerData.fullName}
                          onChange={(e) => setOwnerData({ ...ownerData, fullName: e.target.value })}
                          placeholder="Иван Иванов"
                          required
                        />
                      </div>
                      <div>
                        <Label>Телефон *</Label>
                        <Input
                          value={ownerData.phone}
                          onChange={(e) => setOwnerData({ ...ownerData, phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={ownerData.email}
                          onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
                          placeholder="ivan@example.com"
                        />
                      </div>
                      <div>
                        <Label>Адрес</Label>
                        <Input
                          value={ownerData.address}
                          onChange={(e) => setOwnerData({ ...ownerData, address: e.target.value })}
                          placeholder="ул. Примерная, 123"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Данные питомца</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Кличка *</Label>
                        <Input
                          value={petData.name}
                          onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                          placeholder="Барсик"
                          required
                        />
                      </div>
                      <div>
                        <Label>Вид животного *</Label>
                        <Select
                          value={petData.species}
                          onValueChange={(value) => setPetData({ ...petData, species: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите вид" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Кошка">Кошка</SelectItem>
                            <SelectItem value="Собака">Собака</SelectItem>
                            <SelectItem value="Кролик">Кролик</SelectItem>
                            <SelectItem value="Птица">Птица</SelectItem>
                            <SelectItem value="Хомяк">Хомяк</SelectItem>
                            <SelectItem value="Другое">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Порода</Label>
                        <Input
                          value={petData.breed}
                          onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
                          placeholder="Британская короткошерстная"
                        />
                      </div>
                      <div>
                        <Label>Пол</Label>
                        <Select
                          value={petData.gender}
                          onValueChange={(value) => setPetData({ ...petData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите пол" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Мужской">Мужской</SelectItem>
                            <SelectItem value="Женский">Женский</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Возраст</Label>
                        <Input
                          value={petData.age}
                          onChange={(e) => setPetData({ ...petData, age: e.target.value })}
                          placeholder="2 года"
                        />
                      </div>
                      <div>
                        <Label>Вес (кг)</Label>
                        <Input
                          type="number"
                          value={petData.weight}
                          onChange={(e) => setPetData({ ...petData, weight: e.target.value })}
                          placeholder="4.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="bg-transparent">
                      Назад
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        !ownerData.fullName || !ownerData.phone || !petData.name || !petData.species || submitting
                      }
                      className="flex-1"
                    >
                      {submitting ? "Создание записи..." : "Записаться на прием"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Сводка записи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{clinic.name}</div>
                    <div className="text-sm text-muted-foreground">{clinic.address}</div>
                  </div>
                </div>

                <Separator />

                {selectedVet && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{veterinarians.find((v) => v.id === selectedVet)?.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {veterinarians.find((v) => v.id === selectedVet)?.specialization}
                      </div>
                    </div>
                  </div>
                )}

                {selectedService && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>{services.find((s) => s.id === selectedService)?.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {services.find((s) => s.id === selectedService)?.price.toLocaleString()} ₽
                    </Badge>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {selectedDate.toLocaleDateString("ru-RU", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">{selectedTime}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Важная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Приходите за 10-15 минут до назначенного времени</p>
                <p>• Возьмите с собой ветеринарный паспорт питомца</p>
                <p>• При отмене записи сообщите заранее по телефону</p>
                <p>• Оплата производится после оказания услуг</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
