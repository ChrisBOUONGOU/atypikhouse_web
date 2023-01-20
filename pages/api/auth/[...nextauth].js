import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "../../../lib/back/UserService";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Login",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@domain.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials && credentials.email && credentials.password) {
          const user = loginUser(credentials.email, credentials.password);

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          }

          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.SECRET,
  callbacks: {
    // 1
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    // 3
    async session({ session, user, token }) {
      if (token && token.userRoles) {
        session.userRoles = token.userRoles;
      }
      if (token && token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
    // 2
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user && user.userRoles) {
        token.userRoles = user.userRoles;
      }
      if (user && user.id) {
        token.userId = user.id;
      }
      return token;
    },
  },
});
