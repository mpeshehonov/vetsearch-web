import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Users, ClipboardList, Shield, Eye } from "lucide-react"
import Link from "next/link"

interface ClinicCardProps {
  id: string
  name: string
  image?: string
  rating: number
  reviewsCount: number
  address: string
  phone: string
  description: string
  doctorsCount: number
  servicesCount: number
  averagePrice: number
  isVerified?: boolean
}

export function ClinicCard({
  id,
  name,
  image,
  rating,
  reviewsCount,
  address,
  phone,
  description,
  doctorsCount,
  servicesCount,
  averagePrice,
  isVerified = false
}: ClinicCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow duration-300 border rounded-xl overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Изображение клиники */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg">
              {image ? (
                <AvatarImage src={image} alt={name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground rounded-lg">
                  <ClipboardList className="w-6 h-6" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Основная информация */}
          <div className="flex-1 min-w-0">
            {/* Название и бейдж */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                href={`/clinic/${id}`}
                className="text-lg font-semibold text-primary hover:text-primary/80 group-hover:text-primary/80 transition-colors truncate"
              >
                {name}
              </Link>
              {isVerified && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  <Shield className="w-3 h-3 mr-1" />
                  Проверено
                </Badge>
              )}
            </div>

            {/* Рейтинг */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <Link
                href={`/clinic/${id}#reviews`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 underline decoration-transparent hover:decoration-current"
              >
                <Eye className="w-3 h-3" />
                {reviewsCount} отзывов
              </Link>
            </div>

            {/* Адрес и телефон */}
            <div className="space-y-1 mb-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{phone}</span>
              </div>
            </div>

            {/* Описание */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>

            {/* Статистика и цены */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{doctorsCount} врачей</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardList className="w-4 h-4" />
                  <span>{servicesCount} услуг</span>
                </div>
              </div>
              {averagePrice > 0 && (
                <div className="text-right">
                  <div className="text-sm font-medium">
                    от {averagePrice.toLocaleString()} ₽
                  </div>
                  <div className="text-xs text-muted-foreground">средний прайс</div>
                </div>
              )}
            </div>

            {/* Кнопка записи */}
            <Link href={`/book-appointment?clinic=${id}`} className="inline-block">
              <Button size="sm" className="w-full sm:w-auto transition-transform group-hover:scale-105 duration-200">
                Записаться
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}