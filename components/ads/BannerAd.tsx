"use client";

import { AD_UNITS, type BannerUnitKey } from "@/lib/ads/config";

type BannerAdProps = {
    unit: BannerUnitKey;
    className?: string;
};

function buildSrcDoc(key: string, width: number, height: number) {
    return `
        <!doctype html>
        <html>
            <head>
                <style>
                    html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
                </style>
            </head>
            <body>
                <script>
                    atOptions = {
                        'key': '${key}',
                        'format': 'iframe',
                        'height': ${height},
                        'width': ${width},
                        'params': {}
                    };
                </script>
                <script src="https://deeprootedpressure.com/${key}/invoke.js"></script>
            </body>
        </html>
    `;
}

export default function BannerAd({ unit, className = "" }: BannerAdProps) {
    const config = AD_UNITS[unit];

    if (!config.key) return null;

    return (
        <iframe
            title={`Advertisement ${config.width}x${config.height}`}
            srcDoc={buildSrcDoc(config.key, config.width, config.height)}
            width={config.width}
            height={config.height}
            className={className}
            style={{ border: "none", display: "block", maxWidth: "100%" }}
            scrolling="no"
        />
    );
}
