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
          "http://localhost:3010/auth/login",
          JSON.stringify(credentials),
          { headers: { "Content-Type": "application/json" } }
        );

        const user = res.data;

        if (res.status < 300 && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  },
});
