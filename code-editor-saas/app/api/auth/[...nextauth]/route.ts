import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "mock-github-id",
      clientSecret: process.env.GITHUB_SECRET || "mock-github-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email aur password dono likho!");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Ye email registered nahi hai!");
        }

        if (!user.password) {
          throw new Error("Koshish fail: Is account mein social login configured hai. GitHub se sign in karein.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Ghalat password!");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isPro: user.isPro,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "github") {
        if (!user.email) {
          throw new Error("GitHub email is required to sign in!");
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              name: user.name || "GitHub Developer",
              email: user.email,
              password: null,
              isPro: false,
            },
          });
          user.id = newUser.id;
          user.isPro = newUser.isPro;
        } else {
          user.id = existingUser.id;
          user.isPro = existingUser.isPro;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.isPro = user.isPro;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isPro = token.isPro;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-key-123456",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
