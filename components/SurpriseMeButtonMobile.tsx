"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SurpriseMeButtonMobile() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (loading) return
        setLoading(true)
        try {
            const res = await fetch("/api/random-game")
            const data = await res.json()
            console.log("[surprise-me] response:", data)
            if (data.namespace) {
                router.push(`/detail/${data.namespace}`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            // size="icon"
            onClick={handleClick}
            disabled={loading}
            className="relative border border-primary/50"
            aria-label="Surprise me"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={loading ? "animate-spin" : ""}
            >
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            <span className="sr-only">Surprise me</span>
        </Button>
    )
}
