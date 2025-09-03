"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGeolocation } from "./geolocation-provider"
import { createClient } from "@/lib/supabase/client"

interface City {
  id: string
  name: string
  region: string
}

interface CitySelectorProps {
  selectedCity?: City
  onCitySelect: (city: City) => void
}

export function CitySelector({ selectedCity, onCitySelect }: CitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const { location, requestLocation } = useGeolocation()

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("cities").select("id, name, region").order("name")

        if (error) {
          console.error("[v0] Ошибка загрузки городов:", error)
          // Fallback к жестко заданному списку при ошибке
          setCities([
            { id: "1", name: "Москва", region: "Москва" },
            { id: "2", name: "Санкт-Петербург", region: "Санкт-Петербург" },
            { id: "3", name: "Новосибирск", region: "Новосибирская область" },
            { id: "4", name: "Екатеринбург", region: "Свердловская область" },
            { id: "5", name: "Казань", region: "Республика Татарстан" },
            { id: "6", name: "Нижний Новгород", region: "Нижегородская область" },
            { id: "7", name: "Челябинск", region: "Челябинская область" },
            { id: "8", name: "Самара", region: "Самарская область" },
            { id: "9", name: "Омск", region: "Омская область" },
            { id: "10", name: "Ростов-на-Дону", region: "Ростовская область" },
          ])
        } else {
          setCities(data || [])
        }
      } catch (error) {
        console.error("[v0] Ошибка при загрузке городов:", error)
        // Fallback к жестко заданному списку
        setCities([
          { id: "1", name: "Москва", region: "Москва" },
          { id: "2", name: "Санкт-Петербург", region: "Санкт-Петербург" },
          { id: "3", name: "Новосибирск", region: "Новосибирская область" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  useEffect(() => {
    if (location?.city && !selectedCity) {
      const foundCity = cities.find((city) => city.name.toLowerCase().includes(location.city!.toLowerCase()))
      if (foundCity) {
        onCitySelect(foundCity)
      }
    }
  }, [location, cities, selectedCity, onCitySelect])

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between bg-transparent"
            disabled={loading}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {loading ? "Загрузка..." : selectedCity ? selectedCity.name : "Выберите город"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Поиск города..." />
            <CommandList>
              <CommandEmpty>Город не найден.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => {
                      onCitySelect(city)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{city.name}</span>
                      <span className="text-sm text-muted-foreground">{city.region}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="sm" onClick={requestLocation} className="text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        Определить автоматически
      </Button>
    </div>
  )
}
