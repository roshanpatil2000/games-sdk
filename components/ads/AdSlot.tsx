"use client";

import type { ReactNode } from "react";

type AdSlotProps = {
    children: ReactNode;
    className?: string;
    minHeightClassName?: string;
};

export default function AdSlot({ children, className = "", minHeightClassName = "" }: AdSlotProps) {
    return (
        <div
            className={`flex items-center justify-center rounded-2xl bg-transparent ${minHeightClassName} ${className}`}
        >
            {children}
        </div>
    );
}
