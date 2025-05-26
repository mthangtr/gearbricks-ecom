// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      _id?: string;
      isAdmin?: boolean;
      blindboxSpinCount?: number;
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
          blindboxSpinCount: user.blindboxSpinCount,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
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
            isAdmin: false,
            blindboxSpinCount: 0,
          });
        }
        user.name = dbUser.name;
        (user as unknown as { id: string }).id = dbUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as unknown as { id: string }).id;
        token.name = (user as unknown as { name: string }).name;
        token.isAdmin =
          (user as unknown as { isAdmin: boolean }).isAdmin ?? false;
        token.blindboxSpinCount =
          (user as unknown as { blindboxSpinCount: number })
            .blindboxSpinCount ?? 0;
      } else if (token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id);
        token.isAdmin = dbUser?.isAdmin ?? false;
        token.blindboxSpinCount = dbUser?.blindboxSpinCount ?? 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.blindboxSpinCount = token.blindboxSpinCount as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const runtime = "nodejs";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
