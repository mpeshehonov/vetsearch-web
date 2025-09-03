"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Star } from "lucide-react"

interface ReviewFormProps {
  clinicId?: string
  veterinariansId?: string
  onSuccess: () => void
}

export function ReviewForm({ clinicId, veterinariansId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setLoading(true)
    try {
      const { error } = await supabase.from("reviews").insert({
        clinic_id: clinicId || null,
        veterinarian_id: veterinariansId || null,
        patient_name: patientName,
        patient_email: patientEmail,
        rating,
        title,
        comment,
        is_verified: false,
        is_published: true,
      })

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error("Ошибка отправки отзыва:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base font-medium">Ваша оценка</Label>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Ваше имя</Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Введите ваше имя"
            required
          />
        </div>
        <div>
          <Label htmlFor="patientEmail">Email (необязательно)</Label>
          <Input
            id="patientEmail"
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Заголовок отзыва</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Кратко опишите ваш опыт"
          required
        />
      </div>

      <div>
        <Label htmlFor="comment">Подробный отзыв</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Расскажите подробнее о вашем опыте посещения..."
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={rating === 0 || loading}>
          {loading ? "Отправка..." : "Отправить отзыв"}
        </Button>
      </div>
    </form>
  )
}
