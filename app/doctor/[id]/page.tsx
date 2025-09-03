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
import { MapPin, Phone, Clock, Star, GraduationCap, Calendar, ArrowLeft, Award } from "lucide-react"
import Link from "next/link"

interface Veterinarian {
  id: string
  full_name: string
  specialization: string
  bio: string
  experience_years: number
  education: string
  rating: number
  reviews_count: number
  clinic_name?: string
  clinic_address?: string
  clinic_phone?: string
  city_name?: string
  region?: string
  clinic_id?: string
  avatar_url?: string
}

export default function DoctorPage() {
  const params = useParams()
  const [veterinarian, setVeterinarian] = useState<Veterinarian | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchVeterinarianData = async () => {
      if (!params.id) return

      try {
        // Запрос данных врача с JOIN clinic_veterinarians, clinics, cities
        const { data, error } = await supabase
          .from('clinic_veterinarians')
          .select(`
            profiles!veterinarian_id (
              id,
              full_name,
              specialization,
              bio,
              experience_years,
              education,
              rating,
              reviews_count,
              avatar_url
            ),
            clinics!clinic_id (
              id,
              name,
              address,
              phone,
              cities!city_id (
                name,
                region
              )
            )
          `)
          .eq('veterinarian_id', params.id)
          .eq('is_primary', true)
          .single()

        if (error) throw error

        // Преобразование данных в формат Veterinarian
        if (data && data.profiles && data.clinics && data.clinics.cities) {
          const veterinarian: Veterinarian = {
            ...data.profiles,
            clinic_id: data.clinics.id,
            clinic_name: data.clinics.name,
            clinic_address: data.clinics.address,
            clinic_phone: data.clinics.phone,
            city_name: data.clinics.cities.name,
            region: data.clinics.cities.region,
            avatar_url: data.profiles.avatar_url
          }
          setVeterinarian(veterinarian)
        }
      } catch (error) {
        console.error("Ошибка загрузки данных врача:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVeterinarianData()
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка информации о враче...</p>
        </div>
      </div>
    )
  }

  if (!veterinarian) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Врач не найден</h1>
          <Link href="/">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </div>
    )
  }

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
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {veterinarian.avatar_url ? (
                    <img
                      src={veterinarian.avatar_url}
                      alt={veterinarian.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{veterinarian.full_name}</h1>
                  <Badge className="bg-accent text-accent-foreground mt-2">{veterinarian.specialization}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-semibold">{veterinarian.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({veterinarian.reviews_count} отзывов)</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-4 h-4" />
                  Опыт: {veterinarian.experience_years} лет
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{veterinarian.bio}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {veterinarian.clinic_name}, {veterinarian.city_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{veterinarian.clinic_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>{veterinarian.education}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={`/book-appointment?clinic=${veterinarian.clinic_id}&doctor=${veterinarian.id}`}>
                <Button size="lg" className="w-full lg:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  Записаться к врачу
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
                    <DialogTitle>Оставить отзыв о враче</DialogTitle>
                    <DialogDescription>Поделитесь своим опытом лечения у {veterinarian.full_name}</DialogDescription>
                  </DialogHeader>
                  <ReviewForm
                    veterinariansId={veterinarian.id}
                    onSuccess={() => {
                      setReviewDialogOpen(false)
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
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Профессиональная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Специализация</h4>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {veterinarian.specialization}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Опыт работы</h4>
                  <p className="text-muted-foreground">{veterinarian.experience_years} лет в ветеринарии</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Образование</h4>
                  <p className="text-muted-foreground">{veterinarian.education}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">О враче</h4>
                  <p className="text-muted-foreground">{veterinarian.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Отзывы пациентов</CardTitle>
                <CardDescription>Реальные отзывы от владельцев животных</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsList veterinarianId={veterinarian.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Clinic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Клиника</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Link href={`/clinic/${veterinarian.clinic_id}`} className="font-medium text-primary hover:underline">
                    {veterinarian.clinic_name}
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    {veterinarian.clinic_address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {veterinarian.clinic_phone}
                  </div>
                </div>
                <Link href={`/clinic/${veterinarian.clinic_id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Подробнее о клинике
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Рейтинг</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{veterinarian.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Отзывов</span>
                  <span className="font-medium">{veterinarian.reviews_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Опыт</span>
                  <span className="font-medium">{veterinarian.experience_years} лет</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Запись на прием</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Записаться на прием к {veterinarian.full_name} можно онлайн или по телефону клиники.
                </p>
                <div className="space-y-2">
                  <Link href={`/book-appointment?clinic=${veterinarian.clinic_id}&doctor=${veterinarian.id}`}>
                    <Button className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Записаться онлайн
                    </Button>
                  </Link>
                  <a href={`tel:${veterinarian.clinic_phone}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Phone className="w-4 h-4 mr-2" />
                      Позвонить в клинику
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
