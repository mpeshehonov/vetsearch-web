import * as React from "react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Clock, Building, DollarSign, Wifi, WifiOff, Award, Eye } from "lucide-react"

interface VetCardProps {
  id: string
  name: string
  avatar?: string
  specialty: string
  experience: string | number
  clinicName: string
  avgPrice: number
  rating: number
  reviewsCount: number
  online: boolean
}

export function VetCard({
  id,
  name,
  avatar,
  specialty,
  experience,
  clinicName,
  avgPrice,
  rating,
  reviewsCount,
  online
}: VetCardProps) {
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border rounded-xl overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Аватар врача */}
          <div className="flex-shrink-0 self-center sm:self-start relative">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
              {avatar ? (
                <AvatarImage src={avatar} alt={name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Статус онлайн/оффлайн */}
            <div className="absolute -bottom-2 -right-2">
              <Badge
                variant={online ? "default" : "secondary"}
                className={`flex items-center gap-1 text-xs px-2 py-1 ${
                  online
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {online ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    Онлайн
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    Оффлайн
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Основная информация */}
          <div className="flex-1 min-w-0">
            {/* ФИО и ссылка на профиль */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                href={`/doctor/${id}`}
                className="text-xl font-semibold text-primary hover:text-primary/80 group-hover:text-primary/80 transition-colors truncate"
              >
                {name}
              </Link>
            </div>

            {/* Рейтинг */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <Link
                href={`/doctor/${id}#reviews`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 underline decoration-transparent hover:decoration-current"
              >
                <Eye className="w-3 h-3" />
                {reviewsCount} отзывов
              </Link>
            </div>

            {/* Специальность */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <Award className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground">{specialty}</span>
            </div>

            {/* Опыт работы */}
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Опыт: {experience} лет</span>
            </div>

            {/* Клиника */}
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Building className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{clinicName}</span>
            </div>

            {/* Средний прайс */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="font-medium text-green-600">
                от {avgPrice.toLocaleString()} ₽
              </span>
            </div>

            {/* Кнопка записи */}
            <Link href={`/book-appointment?doctor=${id}`} className="inline-block">
              <Button
                size="sm"
                className="w-full sm:w-auto transition-transform group-hover:scale-105 duration-200 bg-primary hover:bg-primary/90"
              >
                Записаться на прием
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}