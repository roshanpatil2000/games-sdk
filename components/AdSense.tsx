"use client";

import Script from "next/script";
import { useAdsConsent } from "@/components/useAdsConsent";

type AdsenseType = {
    pId: string
}

export const AdSense = ({ pId }: AdsenseType) => {
    const { consent } = useAdsConsent();

    if (consent !== "granted") return null;

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
        />
    )
}
