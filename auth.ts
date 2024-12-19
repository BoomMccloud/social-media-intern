// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Handle redirect
    async redirect({ url, baseUrl }) {
      // Check if the url is relative
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // If the url is already absolute but on the same site, allow it
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Otherwise, redirect to the base url
      return baseUrl;
    },
  },
});
