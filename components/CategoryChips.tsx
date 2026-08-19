import Link from "next/link";
import { fetchCategories } from "@/lib/categories";

export default async function CategoryChips() {
    const categories = await fetchCategories();

    return (
        <div className="m-4 mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {categories.map((category) => (
                <Link
                    key={category.tagNamespace}
                    href={`/genre/${category.tagNamespace}`}
                    className="shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition hover:bg-muted"
                >
                    {category.title}
                </Link>
            ))}
        </div>
    );
}
