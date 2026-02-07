"use client"

import * as React from "react"
import { MoonIcon } from "@/components/ui/moon"
import { SunIcon } from "@/components/ui/sun"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ToggleThemeMobile() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button
            variant="outline"
            // size="icon"
            onClick={toggleTheme}
            className="relative border border-primary/50"
        >
            <SunIcon
                className={`absolute  transition-all duration-300
          ${theme === "dark"
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"}`}
            />

            <MoonIcon
                className={`absolute  transition-all duration-300
          ${theme === "dark"
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"}`}
            />

            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}