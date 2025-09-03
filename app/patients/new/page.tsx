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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function NewPatientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("owner")

  // Данные владельца
  const [ownerData, setOwnerData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact: "",
    notes: "",
  })

  // Данные пациента
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    birth_date: "",
    weight: "",
    color: "",
    microchip_number: "",
    medical_notes: "",
    allergies: "",
  })

  const handleOwnerChange = (field: string, value: string) => {
    setOwnerData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePetChange = (field: string, value: string) => {
    setPetData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Сначала создаем владельца
      const { data: owner, error: ownerError } = await supabase.from("pet_owners").insert([ownerData]).select().single()

      if (ownerError) throw ownerError

      // Затем создаем пациента
      const { error: petError } = await supabase.from("pets").insert([
        {
          ...petData,
          owner_id: owner.id,
          weight: petData.weight ? Number.parseFloat(petData.weight) : null,
        },
      ])

      if (petError) throw petError

      router.push("/patients")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при создании пациента")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/patients" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            ← Назад к пациентам
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-2">Добавить нового пациента</h1>
          <p className="text-gray-600">Заполните информацию о владельце и животном</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner">Владелец</TabsTrigger>
              <TabsTrigger value="pet">Пациент</TabsTrigger>
            </TabsList>

            <TabsContent value="owner">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о владельце</CardTitle>
                  <CardDescription>Контактные данные и дополнительная информация о владельце животного</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner_full_name">Полное имя *</Label>
                      <Input
                        id="owner_full_name"
                        required
                        value={ownerData.full_name}
                        onChange={(e) => handleOwnerChange("full_name", e.target.value)}
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner_phone">Телефон *</Label>
                      <Input
                        id="owner_phone"
                        type="tel"
                        required
                        value={ownerData.phone}
                        onChange={(e) => handleOwnerChange("phone", e.target.value)}
                        placeholder="+7-900-123-45-67"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner_email">Email</Label>
                      <Input
                        id="owner_email"
                        type="email"
                        value={ownerData.email}
                        onChange={(e) => handleOwnerChange("email", e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">Экстренный контакт</Label>
                      <Input
                        id="emergency_contact"
                        value={ownerData.emergency_contact}
                        onChange={(e) => handleOwnerChange("emergency_contact", e.target.value)}
                        placeholder="Контакт для экстренных случаев"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_address">Адрес</Label>
                    <Input
                      id="owner_address"
                      value={ownerData.address}
                      onChange={(e) => handleOwnerChange("address", e.target.value)}
                      placeholder="Улица, дом, квартира"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_notes">Дополнительные заметки</Label>
                    <Textarea
                      id="owner_notes"
                      value={ownerData.notes}
                      onChange={(e) => handleOwnerChange("notes", e.target.value)}
                      placeholder="Любая дополнительная информация о владельце"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("pet")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Далее: Информация о пациенте
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pet">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о пациенте</CardTitle>
                  <CardDescription>Медицинская и общая информация о животном</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pet_name">Кличка *</Label>
                      <Input
                        id="pet_name"
                        required
                        value={petData.name}
                        onChange={(e) => handlePetChange("name", e.target.value)}
                        placeholder="Мурка, Барсик, Рекс..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pet_species">Вид животного *</Label>
                      <Select value={petData.species} onValueChange={(value) => handlePetChange("species", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите вид" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="собака">Собака</SelectItem>
                          <SelectItem value="кошка">Кошка</SelectItem>
                          <SelectItem value="кот">Кот</SelectItem>
                          <SelectItem value="попугай">Попугай</SelectItem>
                          <SelectItem value="хомяк">Хомяк</SelectItem>
                          <SelectItem value="кролик">Кролик</SelectItem>
                          <SelectItem value="другое">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pet_breed">Порода</Label>
                      <Input
                        id="pet_breed"
                        value={petData.breed}
                        onChange={(e) => handlePetChange("breed", e.target.value)}
                        placeholder="Немецкая овчарка, Британская короткошерстная..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pet_gender">Пол</Label>
                      <Select value={petData.gender} onValueChange={(value) => handlePetChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите пол" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Самец</SelectItem>
                          <SelectItem value="female">Самка</SelectItem>
                          <SelectItem value="unknown">Неизвестно</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pet_birth_date">Дата рождения</Label>
                      <Input
                        id="pet_birth_date"
                        type="date"
                        value={petData.birth_date}
                        onChange={(e) => handlePetChange("birth_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pet_weight">Вес (кг)</Label>
                      <Input
                        id="pet_weight"
                        type="number"
                        step="0.1"
                        value={petData.weight}
                        onChange={(e) => handlePetChange("weight", e.target.value)}
                        placeholder="5.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pet_color">Окрас</Label>
                      <Input
                        id="pet_color"
                        value={petData.color}
                        onChange={(e) => handlePetChange("color", e.target.value)}
                        placeholder="Рыжий, черный, полосатый..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="microchip_number">Номер микрочипа</Label>
                    <Input
                      id="microchip_number"
                      value={petData.microchip_number}
                      onChange={(e) => handlePetChange("microchip_number", e.target.value)}
                      placeholder="Номер микрочипа (если есть)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Аллергии</Label>
                    <Textarea
                      id="allergies"
                      value={petData.allergies}
                      onChange={(e) => handlePetChange("allergies", e.target.value)}
                      placeholder="Известные аллергии и непереносимости"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_notes">Медицинские заметки</Label>
                    <Textarea
                      id="medical_notes"
                      value={petData.medical_notes}
                      onChange={(e) => handlePetChange("medical_notes", e.target.value)}
                      placeholder="Хронические заболевания, особенности здоровья"
                      rows={3}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("owner")}>
                      Назад: Владелец
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                      {isLoading ? "Создание..." : "Создать пациента"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
