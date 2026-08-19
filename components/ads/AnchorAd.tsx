"use client";

import Script from "next/script";
import { AD_UNITS } from "@/lib/ads/config";

export default function AnchorAd() {
    const unit = AD_UNITS.anchor;

    if (!unit.src) return null;

    return <Script id="adsterra-anchor" src={unit.src} strategy="afterInteractive" />;
}
