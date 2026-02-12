"use client";
import { useState } from "react";
import { InputInputGroup } from "./Input";
import { ToggleTheme } from "./ToggleTheme";
import { ToggleThemeMobile } from "./ToggleThemeMobile";
import Link from "next/link";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Navbar */}
            <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/95 px-2 py-3 backdrop-blur supports-backdrop-filter:bg-background/90 lg:px-10">
                {/* Logo */}
                <Link href={"/"} >
                    <h1 className="text-2xl font-bold uppercase">
                        Game<span className="text-primary">Pix</span>
                    </h1>
                </Link>
                {/* Desktop */}
                <div className="hidden md:flex gap-3 lg:gap-10">
                    <InputInputGroup />
                    <ToggleTheme />
                </div>

                {/* Hamburger */}
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden text-2xl"
                    aria-label="Open menu"
                >
                    ☰
                </button>
            </div>

            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${open ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 border-l border-border/60 bg-background/95 text-foreground backdrop-blur supports-backdrop-filter:bg-background/90 shadow-lg transform transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Close button */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="text-2xl"
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                {/* Sidebar content */}
                <div className="flex flex-col gap-4 px-4">
                    <InputInputGroup />
                    <ToggleThemeMobile />
                </div>
            </div>
        </>
    );
}
