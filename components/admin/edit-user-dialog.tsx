"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  phone: string | null
  specialization: string | null
  license_number: string | null
  is_active: boolean
}

interface EditUserDialogProps {
  user: User
  onUserUpdated?: () => void
}

export function EditUserDialog({ user, onUserUpdated }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [userData, setUserData] = useState<Omit<User, "id">>({
    email: user.email,
    full_name: user.full_name || "",
    role: user.role,
    phone: user.phone || "",
    specialization: user.specialization || "",
    license_number: user.license_number || "",
    is_active: user.is_active,
  })

  const handleInputChange = (field: keyof Omit<User, "id">, value: string | boolean) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userData.full_name,
          role: userData.role,
          phone: userData.phone,
          specialization: userData.specialization,
          license_number: userData.license_number,
          is_active: userData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setIsOpen(false)
      onUserUpdated?.()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при обновлении пользователя")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when user changes
  useEffect(() => {
    setUserData({
      email: user.email,
      full_name: user.full_name || "",
      role: user.role,
      phone: user.phone || "",
      specialization: user.specialization || "",
      license_number: user.license_number || "",
      is_active: user.is_active,
    })
  }, [user])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактирование пользователя</DialogTitle>
          <DialogDescription>
            Обновите информацию о пользователе {user.email}
          </DialogDescription>
        </DialogHeader>

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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userData.email}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="role">Должность *</Label>
              <Select value={userData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veterinarian">Ветеринар</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="receptionist">Регистратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {userData.role === "veterinarian" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}