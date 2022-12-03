import axios from "axios";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "deCAuFF-provider",
      name: "deCAuFF",
      credentials: {
        email: {
          label: "Email address",
          type: "email",
          placeholder: "claire@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/auth/login`,
          JSON.stringify(credentials),
          { headers: { "Content-Type": "application/json" } }
        );

        const user = res.data;
        console.log("user:");
        console.log(user);

        if (res.status < 300 && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = (token as unknown as User).accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
});
