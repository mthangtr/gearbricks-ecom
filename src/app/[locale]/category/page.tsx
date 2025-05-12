
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/global";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getBaseUrl() {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
}

async function fetchProducts(category: string | null, page: number) {
    const baseUrl = await getBaseUrl();
    const url = new URL(`${baseUrl}/api/products/category`);
    url.searchParams.set("page", page.toString());
    if (category) url.searchParams.set("category", category);

    const res = await fetch(url.toString(), { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch products");

    return res.json();
}

export default async function CategoryPage({
    searchParams,
}: {
    searchParams: { category?: string; page?: string };
}) {
    const { page: rawPage, category: rawCategory } = await searchParams;

    const page = parseInt(rawPage || "1", 10);
    const category = rawCategory || "all";

    let data;
    try {
        data = await fetchProducts(category, page);
    } catch {
        return notFound();
    }

    const { products, pagination } = data;

    const handleCategoryDisplay = (category: string) => {
        switch (category) {
            case "all":
                return "All";
            case "classic":
                return "Classic Cars";
            case "race":
                return "Race Cars";
            case "super":
                return "Super Cars";
            default:
                return category;
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Sản phẩm {category ? `: ${handleCategoryDisplay(category)}` : ""}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {products.length > 0 ? (
                    products.map((product: Product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p>Không tìm thấy sản phẩm.</p>
                )}
            </div>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    {pagination.page > 1 && (
                        <PaginationItem>
                            <PaginationPrevious href={`?category=${category || ""}&page=${pagination.page - 1}`} />
                        </PaginationItem>
                    )}
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                href={`?category=${category || ""}&page=${i + 1}`}
                                isActive={pagination.page === i + 1}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {pagination.page < pagination.totalPages && (
                        <PaginationItem>
                            <PaginationNext href={`?category=${category || ""}&page=${pagination.page + 1}`} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
