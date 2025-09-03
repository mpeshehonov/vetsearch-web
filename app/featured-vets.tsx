"use client"

import { Suspense, useState, useEffect } from "react"
import { getFeaturedVets } from "@/lib/supabase/server"
import { VetCard } from "@/components/VetCard"
import { Skeleton } from "@/components/ui/skeleton"

function VetCardSkeleton() {
  return (
    <div className="border rounded-xl p-6">
      <div className="flex gap-4">
        <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

function FeaturedVetsGrid({ vets }) {
  if (!vets) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vets.map((vet) => (
        <VetCard
          key={vet.id}
          id={vet.id}
          name={vet.name || "Ветеринар"}
          avatar={vet.avatar_url || undefined}
          specialty="Ветеринар"
          experience={5}
          clinicName={vet.clinic_name || "Клиника"}
          avgPrice={1500}
          rating={vet.avg_rating || 4.5}
          reviewsCount={vet.review_count}
          online={Math.random() > 0.5}
        />
      ))}
    </div>
  )
}

export function FeaturedVetsSection() {
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchVets() {
      try {
        setLoading(true)
        setError(null)
        const data = await getFeaturedVets()
        setVets(data)
      } catch (err) {
        setError(err)
        console.error('Ошибка загрузки ветеринаров:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVets()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <VetCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Ошибка загрузки ветеринаров: {error.message || 'Неизвестная ошибка'}
      </div>
    )
  }

  return (
    <FeaturedVetsGrid vets={vets} />
  )
}