import { createClient as createBrowserClient } from './client'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export function createClient() {
  return createBrowserClient()
}

interface ClinicWithRating {
  id: string
  name: string
  description: string | null
  address: string
  phone: string | null
  email: string | null
  website: string | null
  city_id: string | null
  latitude: number | null
  longitude: number | null
  working_hours: any | null
  rating: number
  reviews_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  avg_rating: number | null
  review_count: number
  vets_count: number
  services_count: number
  avg_price: number | null
}

interface VetWithRating {
  id: string
  email: string | null
  name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
  avg_rating: number | null
  review_count: number
  clinic_name: string | null
}

export async function getFeaturedClinics(): Promise<ClinicWithRating[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_featured_clinics')

  if (error) {
    console.error('Ошибка запроса:', error)
    throw error
  }

  return (data || []).map((clinic: any) => ({
    id: clinic.id,
    name: clinic.name,
    description: clinic.description,
    address: clinic.address,
    phone: clinic.phone,
    email: clinic.email,
    website: clinic.website,
    city_id: clinic.city_id,
    latitude: clinic.latitude,
    longitude: clinic.longitude,
    working_hours: clinic.working_hours,
    rating: clinic.rating,
    reviews_count: clinic.reviews_count,
    is_active: clinic.is_active,
    created_at: clinic.created_at,
    updated_at: clinic.updated_at,
    avg_rating: clinic.avg_rating || 0,
    review_count: clinic.review_count || 0,
    vets_count: clinic.vets_count || 0,
    services_count: clinic.services_count || 0,
    avg_price: clinic.avg_price || 0,
  }))
}

export async function getFeaturedVets(): Promise<VetWithRating[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_featured_vets')

  if (error) {
    console.error('Ошибка запроса:', error)
    throw error
  }

  return (data || []).map((profile: any) => ({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar_url: profile.avatar_url,
    role: profile.role,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    avg_rating: profile.avg_rating || null,
    review_count: profile.review_count || 0,
    clinic_name: profile.clinic_name || null
  }))
}
