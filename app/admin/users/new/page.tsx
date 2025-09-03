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
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function NewUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "",
    phone: "",
    specialization: "",
    license_number: "",
    is_active: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Создаем пользователя в auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone,
            specialization: userData.specialization,
            license_number: userData.license_number,
          },
        },
      })

      if (authError) throw authError

      // Профиль создастся автоматически через триггер
      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при создании пользователя")
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-2">Добавить нового пользователя</h1>
          <p className="text-gray-600">Создайте аккаунт для нового сотрудника клиники</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Информация о пользователе</CardTitle>
            <CardDescription>Заполните данные для создания нового аккаунта сотрудника</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Полное имя *</Label>
                  <Input
                    id="full_name"
                    required
                    value={userData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={userData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="doctor@vetclinic.ru"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={userData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Минимум 6 символов"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+7-900-123-45-67"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Должность *</Label>
                <Select value={userData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите должность" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veterinarian">Ветеринар</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="receptionist">Регистратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userData.role === "veterinarian" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Специализация</Label>
                    <Input
                      id="specialization"
                      value={userData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      placeholder="Терапевт, Хирург, Дерматолог..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_number">Номер лицензии</Label>
                    <Input
                      id="license_number"
                      value={userData.license_number}
                      onChange={(e) => handleInputChange("license_number", e.target.value)}
                      placeholder="Номер ветеринарной лицензии"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={userData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Активный пользователь</Label>
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
                  {isLoading ? "Создание..." : "Создать пользователя"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
