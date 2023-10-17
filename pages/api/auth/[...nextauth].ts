import type { Session } from "@lib/session";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider, {
  type DiscordProfile,
} from "next-auth/providers/discord";

import prisma from "@db/index";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          id: user.id as string,
          role: (user as any)?.role as string,
          link: (user as any)?.link || "",
          globalName: (user as any)?.globalName || "",
        },
      };

      return sess;
    },
    async signIn(params) {
      // Check in the database if the user is allowed to sign in
      const user = await prisma.invite.findUnique({
        where: {
          userId: (params.profile as DiscordProfile).username,
        },
      });

      if (!user) {
        console.log("User not found", params.profile);
        return false;
      }

      // Update the user information
      try {
        await prisma.user.update({
          where: {
            name: user.userId,
          },
          data: {
            globalName: (params.profile as DiscordProfile).global_name,
            image: (params.profile as DiscordProfile).image_url,
          },
        });
      } catch (e) {
        console.log("Error updating user", e);
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);
