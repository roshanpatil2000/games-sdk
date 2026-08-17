import Link from "next/link";
import { POPULAR_CATEGORIES, formatCategoryLabel } from "@/lib/categories";

export default function CategoryChips() {
    return (
        <div className="m-4 mt-8 flex gap-2 overflow-x-auto pb-1">
            {POPULAR_CATEGORIES.map((tag) => (
                <Link
                    key={tag}
                    href={`/genre/${tag}`}
                    className="shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition hover:bg-muted"
                >
                    {formatCategoryLabel(tag)}
                </Link>
            ))}
        </div>
    );
}
