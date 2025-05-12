export type Product = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  thumbnailIndex?: number;
  stock?: number;
  category?: string;
  colors?: string[];
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  orders?: Order[];
  reviews?: Review[];
};

export type Order = {
  _id: string;
  userId: string;
  items: Product[];
  total: number;
  createdAt: string;
};

export type MysteryBox = {
  _id: string;
  type: string;
  price: number;
  products: Product[];
};
