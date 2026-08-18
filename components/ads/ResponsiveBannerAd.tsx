"use client";

import BannerAd from "@/components/ads/BannerAd";
import AdSlot from "@/components/ads/AdSlot";

/**
 * Renders a different banner size per breakpoint via CSS visibility
 * (not JS media queries) so there's no hydration mismatch.
 */
export default function ResponsiveBannerAd() {
    return (
        <AdSlot minHeightClassName="min-h-[50px] sm:min-h-15 md:min-h-[250px] lg:min-h-[90px]">
            <div className="block sm:hidden">
                <BannerAd unit="banner_320x50" />
            </div>
            <div className="hidden sm:block md:hidden">
                <BannerAd unit="banner_468x60" />
            </div>
            <div className="hidden md:block lg:hidden">
                <BannerAd unit="banner_300x250" />
            </div>
            <div className="hidden lg:block">
                <BannerAd unit="banner_728x90" />
            </div>
        </AdSlot>
    );
}
