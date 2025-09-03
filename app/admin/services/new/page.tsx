"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function NewServicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    duration_minutes: 30,
    price: "",
    category: "",
    is_active: true,
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setServiceData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("services").insert([
        {
          ...serviceData,
          price: serviceData.price ? Number.parseFloat(serviceData.price) : null,
        },
      ])

      if (error) throw error

      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при создании услуги")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            ← Назад к панели администратора
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-2">Добавить новую услугу</h1>
          <p className="text-gray-600">Создайте новую услугу для клиники</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Информация об услуге</CardTitle>
            <CardDescription>Заполните данные для создания новой услуги</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Название услуги *</Label>
                <Input
                  id="name"
                  required
                  value={serviceData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Общий осмотр, Вакцинация, УЗИ..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={serviceData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Подробное описание услуги"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={serviceData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="examination">Осмотр</SelectItem>
                      <SelectItem value="vaccination">Вакцинация</SelectItem>
                      <SelectItem value="surgery">Хирургия</SelectItem>
                      <SelectItem value="dental">Стоматология</SelectItem>
                      <SelectItem value="diagnostic">Диагностика</SelectItem>
                      <SelectItem value="laboratory">Лабораторные исследования</SelectItem>
                      <SelectItem value="consultation">Консультация</SelectItem>
                      <SelectItem value="emergency">Экстренная помощь</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Продолжительность (минуты) *</Label>
                  <Select
                    value={serviceData.duration_minutes.toString()}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={serviceData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="1500.00"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={serviceData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Активная услуга</Label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Link href="/admin">
                  <Button variant="outline" type="button">
                    Отмена
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                  {isLoading ? "Создание..." : "Создать услугу"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
