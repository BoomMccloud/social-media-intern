// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/utils/prisma";
import type { NextAuthConfig } from "next-auth";
import type { EmailConfig } from "next-auth/providers";
import type { Theme } from "@auth/core/types";
import { Resend } from "resend";

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

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing Resend API Key");
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
  theme: Theme;
  request: Request;
}) {
  const { identifier: email, url, provider, expires } = params;

  if (!provider.from) {
    throw new Error("Missing 'from' email address in provider configuration");
  }

  try {
    const { error } = await resend.emails.send({
      from: provider.from,
      to: email,
      subject: "Sign in to Your Application",
      html: `
        <body>
          <h2>Sign in to Your Application</h2>
          <p>Click the link below to sign in to your account.</p>
          <p><a href="${url}">Sign in</a></p>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>This link will expire on ${expires.toLocaleDateString()} at ${expires.toLocaleTimeString()}.</p>
        </body>
      `,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  } catch (error) {
    throw new Error(`Error sending verification email: ${error}`);
  }
}

const authOptions: NextAuthConfig = {
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
    {
      id: "email",
      type: "email",
      name: "Email",
      server: "",
      from: process.env.EMAIL_FROM || "noreply@example.com",
      maxAge: 24 * 60 * 60, // 24 hours
      sendVerificationRequest,
    },
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
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
export default authOptions;
