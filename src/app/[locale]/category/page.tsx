
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

async function fetchProducts(category: string | null, search: string | null, page: number) {
    const baseUrl = await getBaseUrl();
    const url = new URL(`${baseUrl}/api/products/category`);
    url.searchParams.set("page", page.toString());

    if (search) {
        url.searchParams.set("search", search);
    } else if (category) {
        url.searchParams.set("category", category);
    }

    const res = await fetch(url.toString(), { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch products");

    return res.json();
}

const handleCategoryDisplay = (category: string) => {
    // Chuyển đổi category thành tên hiển thị racing-car -> Racing Car
    //bỏ dấu gạch ngang và viết hoa chữ cái đầu tiên
    return category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default async function CategoryPage({
    searchParams,
}: {
    searchParams: { category?: string; search?: string; page?: string; };
}) {
    const { page: rawPage, category: rawCategory, search: rawSearch } = await searchParams;

    const page = parseInt(rawPage || "1", 10);
    const category = rawCategory || "all";
    const search = rawSearch || null;

    let data;
    try {
        data = await fetchProducts(category, search, page);
    } catch {
        return notFound();
    }

    const { products, pagination } = data;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Sản phẩm
                {search
                    ? `: Tìm kiếm với từ khóa "${search}"`
                    : category
                        ? `: ${handleCategoryDisplay(category)}`
                        : ""}
            </h1>

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
                    {/* Previous */}
                    {pagination.page > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={
                                    search
                                        ? `?search=${encodeURIComponent(search)}&page=${pagination.page - 1}`
                                        : `?category=${encodeURIComponent(category)}&page=${pagination.page - 1}`
                                }
                            />
                        </PaginationItem>
                    )}

                    {/* Page numbers */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                href={
                                    search
                                        ? `?search=${encodeURIComponent(search)}&page=${i + 1}`
                                        : `?category=${encodeURIComponent(category)}&page=${i + 1}`
                                }
                                isActive={pagination.page === i + 1}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Next */}
                    {pagination.page < pagination.totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                href={
                                    search
                                        ? `?search=${encodeURIComponent(search)}&page=${pagination.page + 1}`
                                        : `?category=${encodeURIComponent(category)}&page=${pagination.page + 1}`
                                }
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>

        </div>
    );
}
