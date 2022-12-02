import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
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
          "http://localhost:3010/api/auth/login",
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
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
});
