import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "./lib/password-utils";
export const { handlers, auth, signIn, signOut } = NextAuth({
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
        },
      },
      // 로그인
      async authorize(credentials) {
        if (!credentials) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        const passwordMatch = await comparePassword(
          password,
          user?.hashedPassword,
        );
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
});
