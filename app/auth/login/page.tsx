"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CatIcon = () => (
  <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C10.9 2 10 2.9 10 4C10 4.74 10.4 5.39 11 5.73V7H9C7.9 7 7 7.9 7 9V11C7 12.1 7.9 13 9 13H11V15C11 16.1 11.9 17 13 17H15C16.1 17 17 16.1 17 15V13H19C20.1 13 21 12.1 21 11V9C21 7.9 20.1 7 19 7H17V5.73C17.6 5.39 18 4.74 18 4C18 2.9 17.1 2 16 2C14.9 2 14 2.9 14 4C14 4.74 14.4 5.39 15 5.73V7H13V5.73C13.6 5.39 14 4.74 14 4C14 2.9 13.1 2 12 2Z" />
    <circle cx="10" cy="9" r="1" />
    <circle cx="14" cy="9" r="1" />
    <path d="M12 10.5C11.2 10.5 10.5 11.2 10.5 12S11.2 13.5 12 13.5 13.5 12.8 13.5 12 12.8 10.5 12 10.5Z" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Проверяем, что пользователь успешно авторизован
      if (data.user) {
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка при входе")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <CatIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ВетПоиск</h1>
          <p className="text-gray-600">Платформа поиска ветеринарных услуг</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">Вход в систему</CardTitle>
            <CardDescription className="text-gray-600">Введите ваши данные для входа в систему</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@vetpoisk.ru"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Нет аккаунта?{" "}
              <Link href="/auth/sign-up" className="text-orange-600 hover:text-orange-700 font-medium">
                Зарегистрироваться
              </Link>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
