"use client";

import Script from "next/script";
import { useAdsConsent } from "@/components/useAdsConsent";
import { AD_UNITS } from "@/lib/ads/config";

export default function AnchorAd() {
    const { consent } = useAdsConsent();
    const unit = AD_UNITS.anchor;

    if (consent !== "granted" || !unit.src) return null;

    return <Script id="adsterra-anchor" src={unit.src} strategy="afterInteractive" />;
}
