"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

interface Service {
  id: string
  name: string
  description: string | null
  category: string | null
  price: number | null
  duration_minutes: number
  is_active: boolean
}

interface EditServiceDialogProps {
  service: Service
  onServiceUpdated?: () => void
}

export function EditServiceDialog({ service, onServiceUpdated }: EditServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [serviceData, setServiceData] = useState<Omit<Service, "id">>({
    name: service.name,
    description: service.description || "",
    category: service.category || "",
    price: service.price || 0,
    duration_minutes: service.duration_minutes,
    is_active: service.is_active,
  })

  const handleInputChange = (field: keyof Omit<Service, "id">, value: string | number | boolean) => {
    setServiceData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("services")
        .update({
          name: serviceData.name,
          description: serviceData.description,
          category: serviceData.category,
          price: serviceData.price,
          duration_minutes: serviceData.duration_minutes,
          is_active: serviceData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", service.id)

      if (error) throw error

      setIsOpen(false)
      onServiceUpdated?.()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при обновлении услуги")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when service changes
  useEffect(() => {
    setServiceData({
      name: service.name,
      description: service.description || "",
      category: service.category || "",
      price: service.price || 0,
      duration_minutes: service.duration_minutes,
      is_active: service.is_active,
    })
  }, [service])

  const categories = [
    { value: "Консультации", label: "Консультации" },
    { value: "Диагностика", label: "Диагностика" },
    { value: "Вакцинация", label: "Вакцинация" },
    { value: "Хирургия", label: "Хирургия" },
    { value: "Лаборатория", label: "Лаборатория" },
    { value: "Груминг", label: "Груминг" },
    { value: "Другое", label: "Другое" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактирование услуги</DialogTitle>
          <DialogDescription>
            Обновите информацию об услуге {service.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название услуги *</Label>
              <Input
                id="name"
                required
                value={serviceData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Общий осмотр"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select value={serviceData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={serviceData.price || ""}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Продолжительность (мин)</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="1"
                value={serviceData.duration_minutes}
                onChange={(e) => handleInputChange("duration_minutes", parseInt(e.target.value) || 30)}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={serviceData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Описание услуги..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={serviceData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Услуга активна</Label>
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