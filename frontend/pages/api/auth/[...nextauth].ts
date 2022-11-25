import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { firebaseConfig } from "@/utils/firebase-config";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  adapter: FirestoreAdapter(firebaseConfig),
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  },
});
