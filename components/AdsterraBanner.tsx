"use client";

import Script from "next/script";

export default function AdsterraBanner() {
    return (
        <>
            <Script
                id="adsterra-banner-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        atOptions = {
                            'key' : 'db5c60f6880999a874bf974712eb2996',
                            'format' : 'iframe',
                            'height' : 300,
                            'width' : 160,
                            'params' : {}
                        };
                    `,
                }}
            />
            <Script
                id="adsterra-banner-invoke"
                src="https://deeprootedpressure.com/db5c60f6880999a874bf974712eb2996/invoke.js"
                strategy="afterInteractive"
            />
        </>
    );
}
