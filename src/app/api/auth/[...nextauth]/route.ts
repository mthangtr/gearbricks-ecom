// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import bcrypt from "bcrypt";

// Extend the Session user type to include _id
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      _id?: string;
      isAdmin?: boolean; // <-- thêm
    };
  }
}

// 1. Kết nối DB một lần
await connectDB();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        const user = (await User.findOne({
          email: credentials.email,
        })) as IUser | null;
        if (!user) throw new Error("User not found");
        const valid = await user.comparePassword(credentials.password);
        if (!valid) throw new Error("Invalid password");
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 2. Upsert Google user và gán user.id để jwt callback xài
    async signIn({ user, account }) {
      if (account && account.provider === "google" && user.email) {
        let dbUser = await User.findOne({ email: user.email });
        const randomPassword = Math.random().toString(36).slice(-8);
        const bcryptRandomPassword = await bcrypt.hash(randomPassword, 10);
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name!,
            email: user.email,
            password: bcryptRandomPassword,
          });
        }
        user.name = dbUser.name;
        (user as any).id = dbUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean; // <-- thêm
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // hoặc `/vi/login` nếu bạn dùng locale
    error: "/login", // redirect khi có error
  },
};

// 3. Xuất handler cho App Router (Edge hoặc Node)
export const runtime = "nodejs"; // hoặc omit nếu muốn nodejs
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
