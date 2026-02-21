"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToasterProps = React.HTMLAttributes<HTMLDivElement>

export function Toaster({ className, ...props }: ToasterProps) {
  const [toasts, setToasts] = React.useState<Array<{ id: string; message: string }>>([])

  const addToast = React.useCallback((message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  React.useEffect(() => {
    (window as any).addToast = addToast
    return () => {
      delete (window as any).addToast
    }
  }, [addToast])

  return (
    <div className={cn("fixed top-4 right-4 z-50 space-y-2", className)} {...props}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-background border border-border rounded-md shadow-lg p-4 animate-in slide-in-from-right-full"
        >
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
