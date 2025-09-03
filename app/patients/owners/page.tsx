import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function OwnersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Получаем список владельцев с количеством их животных
  const { data: owners } = await supabase
    .from("pet_owners")
    .select(`
      *,
      pets (
        id,
        name,
        species
      )
    `)
    .order("created_at", { ascending: false })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={profile?.role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile} onSignOut={handleSignOut} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Заголовок и действия */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Владельцы животных</h1>
                <p className="text-gray-600">Управление контактами владельцев</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/patients">
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    Пациенты
                  </Button>
                </Link>
                <Link href="/patients/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Добавить пациента</Button>
                </Link>
              </div>
            </div>

            {/* Поиск */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input placeholder="Поиск по имени, телефону или email..." className="w-full" />
                  </div>
                  <Button variant="outline">Поиск</Button>
                </div>
              </CardContent>
            </Card>

            {/* Список владельцев */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {owners?.map((owner) => (
                <Card key={owner.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{owner.full_name}</CardTitle>
                        <CardDescription className="text-sm">
                          {owner.pets?.length || 0} {owner.pets?.length === 1 ? "животное" : "животных"}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        Активный
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {owner.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {owner.phone}
                        </div>
                      )}
                      {owner.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {owner.email}
                        </div>
                      )}
                      {owner.address && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {owner.address}
                        </div>
                      )}
                    </div>

                    {/* Список животных владельца */}
                    {owner.pets && owner.pets.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Животные:</p>
                        <div className="flex flex-wrap gap-1">
                          {owner.pets.map((pet) => (
                            <Badge key={pet.id} variant="outline" className="text-xs">
                              {pet.name} ({pet.species})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Редактировать
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Контакт
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Пустое состояние */}
            {!owners ||
              (owners.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Владельцы не найдены</h3>
                    <p className="text-gray-600 mb-4">Начните с добавления первого пациента в систему</p>
                    <Link href="/patients/new">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Добавить пациента</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </main>
      </div>
    </div>
  )
}
