"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Star, ThumbsUp, Flag } from "lucide-react"

interface Review {
  id: string
  author_name: string
  rating: number
  title: string
  content: string
  created_at: string
  is_verified: boolean
}

interface ReviewsListProps {
  clinicId?: string
  veterinarianId?: string
}

export function ReviewsList({ clinicId, veterinarianId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating_high" | "rating_low">("newest")
  const supabase = createClient()

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        let query = supabase.from("reviews").select("*")

        if (clinicId) {
          query = query.eq("clinic_id", clinicId)
        }
        if (veterinarianId) {
          query = query.eq("veterinarian_id", veterinarianId)
        }

        // Apply sorting
        switch (sortBy) {
          case "newest":
            query = query.order("created_at", { ascending: false })
            break
          case "oldest":
            query = query.order("created_at", { ascending: true })
            break
          case "rating_high":
            query = query.order("rating", { ascending: false })
            break
          case "rating_low":
            query = query.order("rating", { ascending: true })
            break
        }

        const { data, error } = await query.limit(20)
        if (error) throw error
        setReviews(data || [])
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [clinicId, veterinarianId, sortBy, supabase])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Пока нет отзывов. Будьте первым!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2">
        <Button variant={sortBy === "newest" ? "default" : "outline"} size="sm" onClick={() => setSortBy("newest")}>
          Сначала новые
        </Button>
        <Button
          variant={sortBy === "rating_high" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("rating_high")}
        >
          Высокий рейтинг
        </Button>
        <Button
          variant={sortBy === "rating_low" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("rating_low")}
        >
          Низкий рейтинг
        </Button>
        <Button variant={sortBy === "oldest" ? "default" : "outline"} size="sm" onClick={() => setSortBy("oldest")}>
          Сначала старые
        </Button>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.author_name}</span>
                  {review.is_verified && (
                    <Badge variant="secondary" className="text-xs">
                      Проверенный отзыв
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="w-4 h-4" />
              </Button>
            </div>

            <h4 className="font-medium mb-2">{review.title}</h4>
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{review.content}</p>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Полезно
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
