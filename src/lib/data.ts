import { Product } from "@/types/global";

export const allProducts: Product[] = [
  {
    id: "1",
    slug: "Porsche-GT3-RS",
    name: "Porsche GT3 RS | Pink Edition",
    price: 290000,
    stock: 10,
    category: "supercar",
    images: [
      "https://minibricks.com/cdn/shop/files/IMG-3132.jpg?v=1698154480&width=800",
      "https://minibricks.com/cdn/shop/files/IMG-3133.jpg?v=1698154480&width=800",
      "https://minibricks.com/cdn/shop/files/IMG-3134.jpg?v=1698154479&width=800",
      "https://minibricks.com/cdn/shop/files/IMG_7330.jpg?v=1735379056&width=800",
    ],
    reviews: [
      {
        id: "r1",
        userId: "u1",
        productId: "1",
        rating: 5,
        comment: "Quá đẹp, chi tiết tinh xảo!",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(
  category: string,
  excludeId: string
): Product[] {
  return allProducts.filter(
    (p) => p.category === category && p.id !== excludeId
  );
}
