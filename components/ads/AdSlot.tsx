"use client";

import type { ReactNode } from "react";
import { useAdsConsent } from "@/components/useAdsConsent";

type AdSlotProps = {
    children: ReactNode;
    className?: string;
    minHeightClassName?: string;
};

export default function AdSlot({ children, className = "", minHeightClassName = "" }: AdSlotProps) {
    const { consent } = useAdsConsent();

    return (
        <div
            className={`flex items-center justify-center rounded-2xl bg-[#0b2044] ${minHeightClassName} ${className}`}
        >
            {consent === "granted" ? children : null}
        </div>
    );
}
