"use client"

import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RestrictedActionProps {
  children: ReactNode
  isEmailConfirmed: boolean
  restrictionMessage?: string
  showTooltip?: boolean
}

export function RestrictedAction({
  children,
  isEmailConfirmed,
  restrictionMessage = "Подтвердите email для доступа к этой функции",
  showTooltip = true,
}: RestrictedActionProps) {
  if (isEmailConfirmed) {
    return <>{children}</>
  }

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <div className="opacity-50 pointer-events-none">{children}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{restrictionMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="inline-block">
      <div className="opacity-50 pointer-events-none">{children}</div>
    </div>
  )
}
