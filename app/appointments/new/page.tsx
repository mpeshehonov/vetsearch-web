"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  pet_owners: {
    id: string
    full_name: string
    phone?: string
  }
}

interface Veterinarian {
  id: string
  full_name: string
  specialization?: string
}

interface Service {
  id: string
  name: string
  duration_minutes: number
  price?: number
  category?: string
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const petId = searchParams.get("petId")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [services, setServices] = useState<Service[]>([])

  const [appointmentData, setAppointmentData] = useState({
    pet_id: petId || "",
    veterinarian_id: "",
    service_id: "",
    appointment_date: "",
    appointment_time: "",
    duration_minutes: 30,
    reason: "",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Получаем список пациентов
      const { data: petsData } = await supabase
        .from("pets")
        .select(`
          id,
          name,
          species,
          breed,
          pet_owners (
            id,
            full_name,
            phone
          )
        `)
        .eq("is_active", true)
        .order("name")

      if (petsData) setPets(petsData)

      // Получаем список ветеринаров
      const { data: vetsData } = await supabase
        .from("profiles")
        .select("id, full_name, specialization")
        .eq("role", "veterinarian")
        .eq("is_active", true)
        .order("full_name")

      if (vetsData) setVeterinarians(vetsData)

      // Получаем список услуг
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("name", { ascending: true })

      if (servicesData) setServices(servicesData)
    }

    fetchData()
  }, [])

  const handleInputChange = (field: string, value: string | number) => {
    setAppointmentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    setAppointmentData((prev) => ({
      ...prev,
      service_id: serviceId,
      duration_minutes: service?.duration_minutes || 30,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          ...appointmentData,
          status: "scheduled",
        },
      ])

      if (error) throw error

      router.push("/appointments")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при создании записи")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPet = pets.find((pet) => pet.id === appointmentData.pet_id)
  const selectedService = services.find((service) => service.id === appointmentData.service_id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/appointments" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            ← Назад к записям
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-2">Новая запись на прием</h1>
          <p className="text-gray-600">Создайте запись на прием для пациента</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Форма записи */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Детали записи</CardTitle>
                <CardDescription>Заполните информацию о записи на прием</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Выбор пациента */}
                  <div className="space-y-2">
                    <Label htmlFor="pet_id">Пациент *</Label>
                    <Select
                      value={appointmentData.pet_id}
                      onValueChange={(value) => handleInputChange("pet_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пациента" />
                      </SelectTrigger>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{pet.name}</span>
                              <span className="text-gray-500">({pet.species})</span>
                              <span className="text-gray-400">- {pet.pet_owners.full_name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Выбор ветеринара */}
                  <div className="space-y-2">
                    <Label htmlFor="veterinarian_id">Ветеринар *</Label>
                    <Select
                      value={appointmentData.veterinarian_id}
                      onValueChange={(value) => handleInputChange("veterinarian_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ветеринара" />
                      </SelectTrigger>
                      <SelectContent>
                        {veterinarians.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{vet.full_name}</span>
                              {vet.specialization && <span className="text-gray-500">({vet.specialization})</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Выбор услуги */}
                  <div className="space-y-2">
                    <Label htmlFor="service_id">Услуга</Label>
                    <Select value={appointmentData.service_id} onValueChange={handleServiceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите услугу (опционально)" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{service.name}</span>
                                {service.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {service.category}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{service.duration_minutes} мин</span>
                                {service.price && <span>₽{service.price}</span>}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Дата и время */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointment_date">Дата приема *</Label>
                      <Input
                        id="appointment_date"
                        type="date"
                        required
                        value={appointmentData.appointment_date}
                        onChange={(e) => handleInputChange("appointment_date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointment_time">Время приема *</Label>
                      <Input
                        id="appointment_time"
                        type="time"
                        required
                        value={appointmentData.appointment_time}
                        onChange={(e) => handleInputChange("appointment_time", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Продолжительность */}
                  <div className="space-y-2">
                    <Label htmlFor="duration_minutes">Продолжительность (минуты)</Label>
                    <Select
                      value={appointmentData.duration_minutes.toString()}
                      onValueChange={(value) => handleInputChange("duration_minutes", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 минут</SelectItem>
                        <SelectItem value="30">30 минут</SelectItem>
                        <SelectItem value="45">45 минут</SelectItem>
                        <SelectItem value="60">1 час</SelectItem>
                        <SelectItem value="90">1.5 часа</SelectItem>
                        <SelectItem value="120">2 часа</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Причина визита */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Причина визита *</Label>
                    <Input
                      id="reason"
                      required
                      value={appointmentData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      placeholder="Профилактический осмотр, вакцинация, лечение..."
                    />
                  </div>

                  {/* Дополнительные заметки */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Дополнительные заметки</Label>
                    <Textarea
                      id="notes"
                      value={appointmentData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Любая дополнительная информация о приеме"
                      rows={3}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Link href="/appointments">
                      <Button variant="outline" type="button">
                        Отмена
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                      {isLoading ? "Создание..." : "Создать запись"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Сводка записи */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Сводка записи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPet && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Пациент</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium">{selectedPet.name}</div>
                      <div className="text-sm text-gray-600">
                        {selectedPet.species} {selectedPet.breed && `• ${selectedPet.breed}`}
                      </div>
                      <div className="text-sm text-gray-600">Владелец: {selectedPet.pet_owners.full_name}</div>
                      {selectedPet.pet_owners.phone && (
                        <div className="text-sm text-gray-600">Тел: {selectedPet.pet_owners.phone}</div>
                      )}
                    </div>
                  </div>
                )}

                {appointmentData.veterinarian_id && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ветеринар</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium">
                        {veterinarians.find((v) => v.id === appointmentData.veterinarian_id)?.full_name}
                      </div>
                      {veterinarians.find((v) => v.id === appointmentData.veterinarian_id)?.specialization && (
                        <div className="text-sm text-gray-600">
                          {veterinarians.find((v) => v.id === appointmentData.veterinarian_id)?.specialization}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedService && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Услуга</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium">{selectedService.name}</div>
                      <div className="text-sm text-gray-600">
                        Продолжительность: {selectedService.duration_minutes} мин
                      </div>
                      {selectedService.price && (
                        <div className="text-sm text-gray-600">Стоимость: ₽{selectedService.price}</div>
                      )}
                    </div>
                  </div>
                )}

                {appointmentData.appointment_date && appointmentData.appointment_time && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Дата и время</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium">
                        {new Date(appointmentData.appointment_date).toLocaleDateString("ru-RU", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointmentData.appointment_time} ({appointmentData.duration_minutes} мин)
                      </div>
                    </div>
                  </div>
                )}

                {appointmentData.reason && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Причина визита</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm">{appointmentData.reason}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
