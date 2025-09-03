"use client"

import { Suspense, useState, useEffect } from "react"
import { getFeaturedClinics } from "@/lib/supabase/server"
import { ClinicCard } from "@/components/ClinicCard"
import { Skeleton } from "@/components/ui/skeleton"

function ClinicCardSkeleton() {
  return (
    <div className="border rounded-xl p-6">
      <div className="flex gap-4">
        <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}

function FeaturedClinicsGrid({ clinics }) {
  if (!clinics) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {clinics.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          id={clinic.id}
          name={clinic.name}
          image={undefined}
          rating={clinic.avg_rating || clinic.rating}
          reviewsCount={clinic.review_count || clinic.reviews_count}
          address={clinic.address}
          phone={clinic.phone || ""}
          description={clinic.description || "Специализированная ветеринарная клиника"}
          doctorsCount={clinic.vets_count}
          servicesCount={clinic.services_count}
          averagePrice={clinic.avg_price || 0}
          isVerified={true}
        />
      ))}
    </div>
  )
}

export function FeaturedClinicsSection() {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchClinics() {
      try {
        setLoading(true)
        setError(null)
        const data = await getFeaturedClinics()
        setClinics(data)
      } catch (err) {
        setError(err)
        console.error('Ошибка загрузки клиник:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClinics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <ClinicCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Ошибка загрузки клиник: {error.message || 'Неизвестная ошибка'}
      </div>
    )
  }

  return (
    <FeaturedClinicsGrid clinics={clinics} />
  )
}