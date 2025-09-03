"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmailVerificationBannerProps {
  user: {
    email?: string
    email_confirmed_at?: string
  }
}

export function EmailVerificationBanner({ user }: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  // Не показываем баннер если email уже подтвержден или баннер закрыт
  if (user.email_confirmed_at || isDismissed) {
    return null
  }

  const handleResendEmail = async () => {
    if (!user.email) return

    const supabase = createClient()
    setIsResending(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      setMessage("Письмо с подтверждением отправлено на ваш email")
    } catch (error) {
      setMessage("Ошибка при отправке письма. Попробуйте позже.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <span className="text-amber-800">Ваш email не подтвержден. Некоторые функции могут быть ограничены.</span>
          {message && <div className="mt-2 text-sm text-amber-700">{message}</div>}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendEmail}
            disabled={isResending}
            className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
          >
            {isResending ? "Отправка..." : "Отправить письмо"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-amber-600 hover:bg-amber-100"
          >
            ✕
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
