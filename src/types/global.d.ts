export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  stock?: number;
  category?: string;
  colors?: string[];
  reviews?: Review[];
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  orders?: Order[];
  reviews?: Review[];
};

export type Order = {
  id: string;
  userId: string;
  items: Product[];
  total: number;
  createdAt: string;
};

export type MysteryBox = {
  id: string;
  type: string;
  price: number;
  products: Product[];
};
