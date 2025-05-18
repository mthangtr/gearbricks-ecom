// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";

// Extend the Session user type to include _id
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      _id?: string;
    };
  }
}

await connectDB();

// Base options without maxAge/cookie overrides
const baseOptions: Omit<NextAuthOptions, "session" | "cookies"> & {
  session: { strategy: "jwt" };
  cookies?: NextAuthOptions["cookies"];
} = {
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
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) session.user._id = token.id as string;
      return session;
    },
  },
};

async function handleAuth(req: NextRequest) {
  // parse remember-me flag from query params
  const url = new URL(req.url);
  const remember = url.searchParams.get("remember") === "true";

  // compute maxAge: 30 days if remember, else session cookie
  const maxAge = remember ? 30 * 24 * 60 * 60 : undefined;

  // build full options including dynamic session maxAge and cookie settings
  const options: NextAuthOptions = {
    ...baseOptions,
    session: {
      strategy: "jwt",
      ...(maxAge ? { maxAge } : {}),
    },
    cookies: {
      sessionToken: {
        name: "next-auth.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          ...(maxAge ? { maxAge } : {}),
        },
      },
    },
  };

  // delegate to NextAuth with our dynamic options
  return NextAuth(options)(req);
}

export { handleAuth as GET, handleAuth as POST };
