"use client";

import { useRouter } from "next/navigation";

export default function PlayBackButton() {
    const router = useRouter();

    return (
        <button
            className="rounded-md bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
            onClick={() => router.back()}
        >
            Back
        </button>
    );
}
