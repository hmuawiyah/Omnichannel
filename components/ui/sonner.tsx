"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { LuCircleCheck, LuInfo, LuCircleAlert, LuCircleX, LuLoaderCircle } from "react-icons/lu"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <LuCircleCheck strokeWidth={2} className="size-4" />
        ),
        info: (
          <LuInfo strokeWidth={2} className="size-4" />
        ),
        warning: (
          <LuCircleAlert strokeWidth={2} className="size-4" />
        ),
        error: (
          <LuCircleX strokeWidth={2} className="size-4" />
        ),
        loading: (
          <LuLoaderCircle strokeWidth={2} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
