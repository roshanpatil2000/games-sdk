"use client";

import { useSyncExternalStore } from "react";

export type AdsConsent = "granted" | "denied" | null | "pending";

const ADS_CONSENT_KEY = "ads-consent";
const ADS_CONSENT_EVENT = "ads-consent-changed";

function subscribe(onStoreChange: () => void) {
    const onStorage = (event: StorageEvent) => {
        if (event.key === ADS_CONSENT_KEY) {
            onStoreChange();
        }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(ADS_CONSENT_EVENT, onStoreChange);

    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(ADS_CONSENT_EVENT, onStoreChange);
    };
}

function getSnapshot(): AdsConsent {
    if (typeof window === "undefined") return "pending";
    const value = window.localStorage.getItem(ADS_CONSENT_KEY);
    if (value === "granted" || value === "denied") return value;
    return null;
}

function getServerSnapshot(): AdsConsent {
    return "pending";
}

export function useAdsConsent() {
    const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setConsent = (value: "granted" | "denied") => {
        window.localStorage.setItem(ADS_CONSENT_KEY, value);
        window.dispatchEvent(new Event(ADS_CONSENT_EVENT));
    };

    return { consent, setConsent };
}
