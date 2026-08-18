export type BannerUnit = {
    key: string | null;
    width: number;
    height: number;
};

export type ScriptUnit = {
    src: string | null;
};

export type NativeUnit = {
    containerId: string;
    src: string | null;
};

export const AD_UNITS = {
    popunder: {
        src: "https://deeprootedpressure.com/62/e9/cd/62e9cd0b5b4dd9e2248602658b4c2464.js",
    } satisfies ScriptUnit,
    social_bar: {
        src: "https://deeprootedpressure.com/c3/e2/ce/c3e2cebf7030ca12429ff6abd6d898f0.js",
    } satisfies ScriptUnit,
    anchor: {
        src: null,
    } satisfies ScriptUnit,

    native_main: {
        containerId: "container-e6d315633cd9a02bb55d98ede00fb711",
        src: "https://deeprootedpressure.com/e6d315633cd9a02bb55d98ede00fb711/invoke.js",
    } satisfies NativeUnit,

    banner_160x300: {
        key: "db5c60f6880999a874bf974712eb2996",
        width: 160,
        height: 300,
    } satisfies BannerUnit,
    banner_160x600: {
        key: "6539fd02d9cc2ec9b9e66423987ef3f9",
        width: 160,
        height: 600,
    } satisfies BannerUnit,
    banner_468x60: {
        key: "c1e1792035d823769f689aaa891a83d0",
        width: 468,
        height: 60,
    } satisfies BannerUnit,
    banner_300x250: {
        key: "8ac929ba042373c98f3c3450b6371b35",
        width: 300,
        height: 250,
    } satisfies BannerUnit,
    banner_728x90: {
        key: "8c36c34360032685a81ba025231334af",
        width: 728,
        height: 90,
    } satisfies BannerUnit,
    banner_320x50: {
        key: "b96676d715cfe902a742fc564fd23a86",
        width: 320,
        height: 50,
    } satisfies BannerUnit,
} as const;

export type BannerUnitKey = {
    [K in keyof typeof AD_UNITS]: (typeof AD_UNITS)[K] extends BannerUnit ? K : never;
}[keyof typeof AD_UNITS];
