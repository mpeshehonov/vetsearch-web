"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CitySelector } from "@/components/city-selector"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Search, MapPin, Star, Clock, Phone, Shield, Users } from "lucide-react"

const CatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.9 2 10 2.9 10 4C10 4.74 10.4 5.39 11 5.73V7H8C6.9 7 6 7.9 6 9V11C6 12.1 6.9 13 8 13H11V15.27C10.4 15.61 10 16.26 10 17C10 18.1 10.9 19 12 19S14 18.1 14 17C14 16.26 13.6 15.61 13 15.27V13H16C17.1 13 18 12.1 18 11V9C18 7.9 17.1 7 16 7H13V5.73C13.6 5.39 14 4.74 14 4C14 2.9 13.1 2 12 2M8.5 9.5C8.78 9.5 9 9.72 9 10S8.78 10.5 8.5 10.5 8 10.28 8 10 8.22 9.5 8.5 9.5M15.5 9.5C15.78 9.5 16 9.72 16 10S15.78 10.5 15.5 10.5 15 10.28 15 10 15.22 9.5 15.5 9.5M12 11.5C11.17 11.5 10.5 10.83 10.5 10S11.17 8.5 12 8.5 13.5 9.17 13.5 10 12.83 11.5 12 11.5Z" />
  </svg>
)

interface City {
  id: string
  name: string
  region: string
}

interface Clinic {
  id: string
  name: string
  description: string
  address: string
  phone: string
  rating: number
  reviews_count: number
  city_name: string
  veterinarians_count: number
  services_count: number
  specializations: string[]
  is_verified: boolean
}

interface Veterinarian {
  id: string
  full_name: string
  specialization: string
  bio: string
  experience_years: number
  rating: number
  reviews_count: number
  clinic_name: string
  clinic_address: string
  city_name: string
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<City>()
  const [searchType, setSearchType] = useState<"clinics" | "doctors">("clinics")
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const searchClinics = async () => {
    if (!selectedCity) return

    setLoading(true)
    try {
      let query = supabase
        .from("clinics")
        .select(`
          id,
          name,
          description,
          address,
          phone,
          rating,
          reviews_count,
          cities!inner(name),
          clinic_veterinarians(count),
          clinic_services(count)
        `)
        .eq("cities.name", selectedCity.name)
        .eq("is_active", true)
        .order("rating", { ascending: false })

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.limit(6)
      if (error) throw error

      const formattedClinics =
        data?.map((clinic) => ({
          id: clinic.id,
          name: clinic.name,
          description: clinic.description,
          address: clinic.address,
          phone: clinic.phone,
          rating: clinic.rating || 0,
          reviews_count: clinic.reviews_count || 0,
          city_name: clinic.cities?.name || selectedCity.name,
          veterinarians_count: clinic.clinic_veterinarians?.length || 0,
          services_count: clinic.clinic_services?.length || 0,
          specializations: [],
          is_verified: true,
        })) || []

      setClinics(formattedClinics)
    } catch (error) {
      console.error("Ошибка поиска клиник:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchVeterinarians = async () => {
    if (!selectedCity) return

    setLoading(true)
    try {
      // First get veterinarians from profiles table
      let profileQuery = supabase
        .from("profiles")
        .select("id, full_name, specialization")
        .eq("role", "veterinarian")
        .eq("is_active", true)

      if (searchQuery) {
        profileQuery = profileQuery.or(`full_name.ilike.%${searchQuery}%,specialization.ilike.%${searchQuery}%`)
      }

      const { data: profilesData, error: profilesError } = await profileQuery.limit(6)
      if (profilesError) throw profilesError

      if (!profilesData || profilesData.length === 0) {
        setVeterinarians([])
        return
      }

      // Get clinic information for these veterinarians
      const veterinarianIds = profilesData.map((v) => v.id)
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinic_veterinarians")
        .select(`
          veterinarian_id,
          clinics!inner(
            name,
            address,
            cities!inner(name)
          )
        `)
        .in("veterinarian_id", veterinarianIds)
        .eq("clinics.cities.name", selectedCity.name)

      if (clinicError) throw clinicError

      // Combine the data
      const formattedVets = profilesData
        .filter((vet) => {
          // Only include vets that work in the selected city
          return clinicData?.some((clinic) => clinic.veterinarian_id === vet.id)
        })
        .map((vet) => {
          const clinicInfo = clinicData?.find((clinic) => clinic.veterinarian_id === vet.id)
          return {
            id: vet.id,
            full_name: vet.full_name,
            specialization: vet.specialization || "Ветеринар",
            bio: `Опытный ветеринар со специализацией ${vet.specialization}`,
            experience_years: 5,
            rating: 4.5,
            reviews_count: 10,
            clinic_name: clinicInfo?.clinics?.name || "Клиника",
            clinic_address: clinicInfo?.clinics?.address || "",
            city_name: selectedCity.name,
          }
        })

      setVeterinarians(formattedVets)
    } catch (error) {
      console.error("Ошибка поиска ветеринаров:", error)
      setVeterinarians([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCity) {
      if (searchType === "clinics") {
        searchClinics()
      } else {
        searchVeterinarians()
      }
    }
  }, [selectedCity, searchType])

  const handleSearch = () => {
    if (searchType === "clinics") {
      searchClinics()
    } else {
      searchVeterinarians()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                <CatIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">ВетПоиск</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#clinics" className="text-muted-foreground hover:text-primary transition-colors">
                Клиники
              </a>
              <a href="#doctors" className="text-muted-foreground hover:text-primary transition-colors">
                Врачи
              </a>
              <Link href="/for-clinics" className="text-muted-foreground hover:text-primary transition-colors">
                Клиникам
              </Link>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                О нас
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="bg-transparent">
                  Войти
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Регистрация</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-card via-muted/30 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Найдите лучшего
            <span className="text-primary block">ветеринара рядом</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-pretty">
            Поиск проверенных ветеринарных клиник и врачей с отзывами реальных клиентов. Записывайтесь на прием онлайн в
            удобное время.
          </p>

          {/* Search Interface */}
          <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={searchType === "clinics" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSearchType("clinics")}
                  className="flex-1"
                >
                  Клиники
                </Button>
                <Button
                  variant={searchType === "doctors" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSearchType("doctors")}
                  className="flex-1"
                >
                  Врачи
                </Button>
              </div>
              <CitySelector selectedCity={selectedCity} onCitySelect={setSelectedCity} />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={searchType === "clinics" ? "Поиск клиник..." : "Поиск врачей..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={!selectedCity || loading}>
                {loading ? "Поиск..." : "Найти"}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Клиник</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1200+</div>
              <div className="text-sm text-muted-foreground">Врачей</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">15000+</div>
              <div className="text-sm text-muted-foreground">Отзывов</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Городов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {(clinics.length > 0 || veterinarians.length > 0) && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {searchType === "clinics" ? "Найденные клиники" : "Найденные врачи"}
              {selectedCity && ` в городе ${selectedCity.name}`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchType === "clinics" &&
                clinics.map((clinic) => (
                  <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 flex items-center gap-2">
                            <Link href={`/clinic/${clinic.id}`} className="hover:text-primary">
                              {clinic.name}
                            </Link>
                            {clinic.is_verified && (
                              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                <Shield className="w-3 h-3 mr-1" />
                                Проверено
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{clinic.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({clinic.reviews_count})</span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">{clinic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {clinic.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {clinic.veterinarians_count} врачей, {clinic.services_count} услуг
                        </div>
                      </div>

                      {clinic.specializations && clinic.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {clinic.specializations.slice(0, 3).map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Link href={`/book-appointment?clinic=${clinic.id}`}>
                        <Button className="w-full">Записаться на прием</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}

              {searchType === "doctors" &&
                veterinarians.map((vet) => (
                  <Card key={vet.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg mb-2">
                        <Link href={`/doctor/${vet.id}`} className="hover:text-primary">
                          {vet.full_name}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{vet.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({vet.reviews_count})</span>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {vet.specialization}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Опыт: {vet.experience_years} лет
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {vet.clinic_name}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{vet.bio}</p>

                      <Link href={`/book-appointment?doctor=${vet.id}`}>
                        <Button className="w-full">Записаться к врачу</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Почему выбирают нас?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы помогаем найти лучших ветеринаров и клиники для ваших питомцев
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Проверенные специалисты</CardTitle>
                <CardDescription>
                  Все врачи и клиники проходят тщательную проверку документов и квалификации
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Реальные отзывы</CardTitle>
                <CardDescription>Читайте отзывы других владельцев животных и делитесь своим опытом</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-chart-3" />
                </div>
                <CardTitle>Удобная запись</CardTitle>
                <CardDescription>Записывайтесь на прием онлайн в любое удобное время без звонков</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <CatIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">ВетПоиск</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Платформа для поиска лучших ветеринарных клиник и врачей в вашем городе.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Поиск</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#clinics" className="hover:text-primary transition-colors">
                    Клиники
                  </a>
                </li>
                <li>
                  <a href="#doctors" className="hover:text-primary transition-colors">
                    Врачи
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-primary transition-colors">
                    Услуги
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Аккаунт</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-primary transition-colors">
                    Войти
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-primary transition-colors">
                    Регистрация
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ВетПоиск. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
