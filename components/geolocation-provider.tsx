"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface GeolocationContextType {
  location: {
    latitude: number
    longitude: number
    city?: string
  } | null
  loading: boolean
  error: string | null
  requestLocation: () => void
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined)

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<GeolocationContextType["location"]>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCityFromCoordinates = async (lat: number, lng: number) => {
    try {
      // Используем бесплатный API для геокодирования
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ru`,
      )
      const data = await response.json()
      return data.city || data.locality || data.principalSubdivision || "Неизвестный город"
    } catch (error) {
      console.error("Ошибка определения города:", error)
      return null
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим браузером")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const city = await getCityFromCoordinates(latitude, longitude)

        setLocation({
          latitude,
          longitude,
          city: city || undefined,
        })
        setLoading(false)
      },
      (error) => {
        let errorMessage = "Не удалось определить местоположение"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Доступ к геолокации запрещен"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Информация о местоположении недоступна"
            break
          case error.TIMEOUT:
            errorMessage = "Время ожидания определения местоположения истекло"
            break
        }

        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 минут
      },
    )
  }

  useEffect(() => {
    // Проверяем, есть ли сохраненное местоположение
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation))
      } catch (error) {
        console.error("Ошибка загрузки сохраненного местоположения:", error)
      }
    } else {
      // Если нет сохраненного местоположения, запрашиваем его
      requestLocation()
    }
  }, [])

  useEffect(() => {
    if (location) {
      localStorage.setItem("userLocation", JSON.stringify(location))
    }
  }, [location])

  return (
    <GeolocationContext.Provider value={{ location, loading, error, requestLocation }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation() {
  const context = useContext(GeolocationContext)
  if (context === undefined) {
    throw new Error("useGeolocation must be used within a GeolocationProvider")
  }
  return context
}
