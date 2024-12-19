// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth Credentials");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    signIn: "/login", // Specify your custom login page
    signOut: "/logout", // Optional: specify custom logout page
    error: "/auth/error", // Optional: custom error page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow redirects to the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default fallback
      return baseUrl;
    },
    async session({ session, token }) {
      // Add additional session properties if needed
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          // Add any additional token properties you need
        };
      }
      return token;
    },
  },
});
