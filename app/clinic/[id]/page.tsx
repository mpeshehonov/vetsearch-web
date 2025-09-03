"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { createClient } from "@/lib/supabase/client"
import { MapPin, Phone, Clock, Star, Shield, Users, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Clinic {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  rating: number
  reviews_count: number
  city_name: string
  region: string
  veterinarians_count: number
  services_count: number
  specializations: string[]
  is_verified: boolean
  working_hours: any
}

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration_minutes: number
}

interface Veterinarian {
  id: string
  full_name: string
  specialization: string
  bio: string
  experience_years: number
  rating: number
  reviews_count: number
}

export default function ClinicPage() {
  const params = useParams()
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchClinicData = async () => {
      if (!params.id) return

      try {
        // Fetch clinic details
        const { data: clinicData, error: clinicError } = await supabase
          .from("clinic_search_view")
          .select("*")
          .eq("id", params.id)
          .single()

        if (clinicError) throw clinicError
        setClinic(clinicData)

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("clinic_id", params.id)
          .eq("is_active", true)
          .order("category", { ascending: true })

        if (servicesError) throw servicesError
        setServices(servicesData || [])

        // Fetch veterinarians
        const { data: vetsData, error: vetsError } = await supabase
          .from("veterinarian_search_view")
          .select("*")
          .eq("clinic_id", params.id)

        if (vetsError) throw vetsError
        setVeterinarians(vetsData || [])
      } catch (error) {
        console.error("Ошибка загрузки данных клиники:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClinicData()
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка информации о клинике...</p>
        </div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Клиника не найдена</h1>
          <Link href="/">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </div>
    )
  }

  const groupedServices = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к поиску
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-foreground">{clinic.name}</h1>
                {clinic.is_verified && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Shield className="w-3 h-3 mr-1" />
                    Проверено
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-semibold">{clinic.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({clinic.reviews_count} отзывов)</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {clinic.veterinarians_count} врачей
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{clinic.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {clinic.address}, {clinic.city_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{clinic.phone}</span>
                </div>
                {clinic.working_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={`/book-appointment?clinic=${clinic.id}`}>
                <Button size="lg" className="w-full lg:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  Записаться на прием
                </Button>
              </Link>
              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full lg:w-auto bg-transparent">
                    Оставить отзыв
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Оставить отзыв о клинике</DialogTitle>
                    <DialogDescription>Поделитесь своим опытом посещения {clinic.name}</DialogDescription>
                  </DialogHeader>
                  <ReviewForm
                    clinicId={clinic.id}
                    onSuccess={() => {
                      setReviewDialogOpen(false)
                      // Refresh clinic data to update rating
                      window.location.reload()
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Specializations */}
            {clinic.specializations && clinic.specializations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Специализации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {Object.keys(groupedServices).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Услуги и цены</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(groupedServices).map(([category, categoryServices]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-lg mb-3">{category}</h3>
                        <div className="space-y-3">
                          {categoryServices.map((service) => (
                            <div
                              key={service.id}
                              className="flex justify-between items-start p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium">{service.name}</h4>
                                {service.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>Длительность: {service.duration_minutes} мин</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-semibold">{service.price.toLocaleString()} ₽</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Отзывы пациентов</CardTitle>
                <CardDescription>Реальные отзывы от владельцев животных</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsList clinicId={clinic.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Veterinarians */}
            {veterinarians.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Врачи клиники</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {veterinarians.map((vet) => (
                      <div key={vet.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{vet.full_name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{vet.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          {vet.specialization}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{vet.bio}</p>
                        <div className="text-xs text-muted-foreground">
                          Опыт: {vet.experience_years} лет • {vet.reviews_count} отзывов
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Адрес</div>
                  <div className="text-sm text-muted-foreground">{clinic.address}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Телефон</div>
                  <div className="text-sm text-muted-foreground">{clinic.phone}</div>
                </div>
                {clinic.email && (
                  <div>
                    <div className="text-sm font-medium mb-1">Email</div>
                    <div className="text-sm text-muted-foreground">{clinic.email}</div>
                  </div>
                )}
                {clinic.website && (
                  <div>
                    <div className="text-sm font-medium mb-1">Сайт</div>
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {clinic.website}
                    </a>
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
