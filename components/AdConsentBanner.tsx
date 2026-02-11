"use client";

import { useAdsConsent } from "@/components/useAdsConsent";

export default function AdConsentBanner() {
    const { consent, setConsent } = useAdsConsent();

    if (consent === "pending" || consent !== null) return null;

    return (
        <div className="fixed inset-x-4 bottom-4 z-[100] rounded-xl border bg-background p-4 shadow-2xl md:inset-x-auto md:right-4 md:w-[420px]">
            <p className="text-sm font-semibold">Cookie preference</p>
            <p className="mt-1 text-xs text-muted-foreground">
                Allow ad cookies to support this site. You can continue without ads.
            </p>
            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    className="rounded-md border px-3 py-1.5 text-xs"
                    onClick={() => setConsent("denied")}
                >
                    Continue without ads
                </button>
                <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                    onClick={() => setConsent("granted")}
                >
                    Allow ads
                </button>
            </div>
        </div>
    );
}
