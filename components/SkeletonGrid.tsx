const GameCardSkeleton = () => {
    return (
        <div className="relative rounded-lg overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-3/4 w-full bg-muted animate-pulse rounded-lg" />

            {/* Optional text overlay skeleton */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 space-y-2">
                <div className="h-4 w-3/4 bg-muted/80 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted/60 rounded animate-pulse" />
            </div>
        </div>
    )
}

const SkeletonGrid = ({ count = 12 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 m-4">
            {Array.from({ length: count }).map((_, i) => (
                <GameCardSkeleton key={i} />
            ))}
        </div>
    )
}

export default SkeletonGrid;