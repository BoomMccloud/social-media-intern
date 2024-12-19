// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/utils/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      credits: number;
      lastLogin: Date | null;
    };
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth Credentials");
}

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;

        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            credits: true,
            lastLogin: true,
          },
        });

        session.user.credits = userData?.credits ?? 0;
        session.user.lastLogin = userData?.lastLogin ?? null;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLogin: new Date(),
            },
          });
        } catch (error) {
          console.error("Error updating last login:", error);
        }

        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
        };
      }
      return token;
    },
  },
  events: {
    createUser: async ({ user }) => {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: 10,
            lastLogin: new Date(),
          },
        });
      } catch (error) {
        console.error("Error initializing new user:", error);
      }
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

// Add a default export of the config
export default authOptions;
