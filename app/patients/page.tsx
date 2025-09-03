import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { Header } from "@/components/navigation/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function PatientsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Получаем список пациентов с информацией о владельцах
  const { data: pets } = await supabase
    .from("pets")
    .select(`
      *,
      pet_owners (
        id,
        full_name,
        phone,
        email
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case "собака":
        return "🐕"
      case "кошка":
      case "кот":
        return "🐱"
      case "попугай":
        return "🦜"
      case "хомяк":
        return "🐹"
      default:
        return "🐾"
    }
  }

  const getAgeFromBirthDate = (birthDate: string) => {
    if (!birthDate) return "Неизвестно"
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

    if (ageInMonths < 12) {
      return `${ageInMonths} мес.`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years} г. ${months} мес.` : `${years} г.`
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={profile?.role} />
      <SidebarInset>
        <Header user={profile} onSignOut={handleSignOut} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Пациенты</h1>
                <p className="text-sm sm:text-base text-gray-600">Управление животными и их владельцами</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Link href="/patients/owners">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    Владельцы
                  </Button>
                </Link>
                <Link href="/patients/new">
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">Добавить пациента</Button>
                </Link>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input placeholder="Поиск по кличке, виду или владельцу..." className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                      Все виды
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                      Фильтры
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pets?.map((pet) => (
                <Card key={pet.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getSpeciesIcon(pet.species)}</div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate">{pet.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                            {pet.breed || pet.species} •{" "}
                            {pet.gender === "male" ? "Самец" : pet.gender === "female" ? "Самка" : "Неизвестно"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                        {getAgeFromBirthDate(pet.birth_date)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">Владелец:</span>
                        <span className="ml-1 truncate">{pet.pet_owners?.full_name}</span>
                      </div>
                      {pet.pet_owners?.phone && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="truncate">{pet.pet_owners.phone}</span>
                        </div>
                      )}
                      {pet.weight && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                            />
                          </svg>
                          <span className="font-medium">Вес:</span> {pet.weight} кг
                        </div>
                      )}
                      {pet.color && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a4 4 0 004 4z"
                            />
                          </svg>
                          <span className="font-medium">Окрас:</span>
                          <span className="ml-1 truncate">{pet.color}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Link href={`/patients/${pet.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent text-xs sm:text-sm">
                          Подробнее
                        </Button>
                      </Link>
                      <Link href={`/appointments/new?petId=${pet.id}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm">
                          Записать
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!pets ||
              (pets.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Пациенты не найдены</h3>
                    <p className="text-gray-600 mb-4">Начните с добавления первого пациента в систему</p>
                    <Link href="/patients/new">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Добавить пациента</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
