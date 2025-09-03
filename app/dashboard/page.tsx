import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { Header } from "@/components/navigation/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Получаем профиль пользователя
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const isEmailConfirmed = true // Всегда разрешаем доступ

  // Получаем статистику
  const { data: petsCount } = await supabase.from("pets").select("id", { count: "exact" })
  const { data: appointmentsToday } = await supabase
    .from("appointments")
    .select("id", { count: "exact" })
    .eq("appointment_date", new Date().toISOString().split("T")[0])
    .eq("status", "scheduled")

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={profile?.role} />
      <SidebarInset>
        <Header user={profile} onSignOut={handleSignOut} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Добро пожаловать, {profile?.full_name || data.user.email}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Панель управления ВетПоиск</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Всего пациентов</CardTitle>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600"
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
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{petsCount?.length || 0}</div>
                  <p className="text-xs text-muted-foreground hidden sm:block">Зарегистрированных животных</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Приемы сегодня</CardTitle>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{appointmentsToday?.length || 0}</div>
                  <p className="text-xs text-muted-foreground hidden sm:block">Запланированных приемов</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Активные врачи</CardTitle>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground hidden sm:block">Работают сегодня</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Доходы месяца</CardTitle>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">₽125,000</div>
                  <p className="text-xs text-muted-foreground hidden sm:block">+12% к прошлому месяцу</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2"
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
                    Пациенты
                  </CardTitle>
                  <CardDescription className="text-sm">Управление животными и их владельцами</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/patients">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm sm:text-base">
                      Перейти к пациентам
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Записи на прием
                  </CardTitle>
                  <CardDescription className="text-sm">Управление расписанием и записями</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/appointments">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm sm:text-base">
                      Управление записями
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Медицинские карты
                  </CardTitle>
                  <CardDescription className="text-sm">История болезни и лечения</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/medical-records">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm sm:text-base">
                      Медицинские карты
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
