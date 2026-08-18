"use client";

import Script from "next/script";
import { AD_UNITS } from "@/lib/ads/config";

/**
 * Adsterra's native invoke.js is bound to a single fixed container id tied to
 * the ad key, so this only renders once effectively per page even if used in
 * multiple call sites (duplicate container ids are a no-op for the script,
 * not an error). A second native placement needs its own key from Adsterra
 * before it can render independently — add it to lib/ads/config.ts as
 * native_secondary and give this component a `unit` prop when that's ready.
 */
export default function NativeAd() {
    const unit = AD_UNITS.native_main;

    if (!unit.src) return null;

    return (
        <>
            <Script async data-cfasync="false" src={unit.src} strategy="afterInteractive" />
            <div id={unit.containerId} className="w-full" />
        </>
    );
}
