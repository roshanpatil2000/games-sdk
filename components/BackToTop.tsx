"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

type Position = { x: number; y: number }

export default function BackToTop() {
    const btnRef = useRef<HTMLButtonElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState<Position>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("backToTopPosition")
            return saved ? JSON.parse(saved) : { x: 24, y: 24 }
        }
        return { x: 24, y: 24 }
    })

    const isDragging = useRef(false)
    const offset = useRef({ x: 0, y: 0 })

    // show / hide
    useEffect(() => {
        const onScroll = () => setIsVisible(window.scrollY > 300)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // save position
    useEffect(() => {
        localStorage.setItem("backToTopPosition", JSON.stringify(position))
    }, [position])

    const onPointerDown = (e: React.PointerEvent) => {
        isDragging.current = true
        const rect = btnRef.current!.getBoundingClientRect()
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
        btnRef.current?.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return

        setPosition({
            x: window.innerWidth - e.clientX - offset.current.x,
            y: window.innerHeight - e.clientY - offset.current.y,
        })
    }

    const onPointerUp = (e: React.PointerEvent) => {
        isDragging.current = false
        btnRef.current?.releasePointerCapture(e.pointerId)
    }

    const scrollToTop = () => {
        if (!isDragging.current) {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    if (!isVisible) return null

    return (
        <button
            ref={btnRef}
            onClick={scrollToTop}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            aria-label="Back to top"
            className="
        fixed z-50
        rounded-full p-3
        bg-black text-white
        shadow-xl
        cursor-grab active:cursor-grabbing
        select-none
      "
            style={{
                bottom: position.y,
                right: position.x,
            }}
        >
            <ArrowUp size={20} />
        </button>
    )
}