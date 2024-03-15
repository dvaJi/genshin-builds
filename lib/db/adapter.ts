// Most of the code is taken from: https://github.com/nextauthjs/next-auth/pull/7165
import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import type { Adapter, VerificationToken } from "next-auth/adapters";
import { db } from "./index";
import { accounts, sessions, users, verificationTokens } from "./schema";

export function DrizzleAdapter(database: typeof db): Adapter {
  return {
    createUser: (data) => {
      return database
        .insert(users)
        .values({ ...data, id: createId() })
        .returning()
        .get();
    },
    getUser: async (id) => {
      const select =
        (await database.select().from(users).where(eq(users.id, id)).get()) ??
        null;
      return select;
    },
    getUserByEmail: async (email) => {
      const select =
        (await database
          .select()
          .from(users)
          .where(eq(users.email, email))
          .get()) ?? null;

      return select;
    },
    createSession: (session) => {
      return database.insert(sessions).values(session).returning().get();
    },
    getSessionAndUser: async (sessionToken) => {
      const select =
        (await database
          .select({
            session: sessions,
            user: users,
          })
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .innerJoin(users, eq(users.id, sessions.userId))
          .get()) ?? null;
      return select;
    },
    updateUser: (user) => {
      return database
        .update(users)
        .set(user)
        .where(eq(users.id, user.id))
        .returning()
        .get();
    },
    updateSession: (session) => {
      return database
        .update(sessions)
        .set(session)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .returning()
        .get();
    },
    linkAccount: async (rawAccount) => {
      await database.insert(accounts).values(rawAccount).returning().get();

      // const account = {
      // 	...updatedAccount,
      // 	access_token: updatedAccount.access_token ?? undefined,
      // 	token_type: updatedAccount.token_type ?? undefined,
      // 	id_token: updatedAccount.id_token ?? undefined,
      // 	refresh_token: updatedAccount.refresh_token ?? undefined,
      // 	scope: updatedAccount.scope ?? undefined,
      // 	expires_at: updatedAccount.expires_at ?? undefined,
      // 	session_state: updatedAccount.session_state ?? undefined,
      // };

      return;
    },
    getUserByAccount: async (account) => {
      const select =
        (await database
          .select({
            id: users.id,
            email: users.email,
            emailVerified: users.emailVerified,
            image: users.image,
            name: users.name,
          })
          .from(users)
          .innerJoin(
            accounts,
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider)
            )
          )
          .get()) ?? null;
      return select;
    },
    deleteSession: (sessionToken) => {
      return (
        database
          .delete(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .returning()
          .get() ?? null
      );
    },
    createVerificationToken: (verificationToken) => {
      return database
        .insert(verificationTokens)
        .values(verificationToken)
        .returning()
        .get();
    },
    useVerificationToken: async (verificationToken) => {
      try {
        return (database
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, verificationToken.identifier),
              eq(verificationTokens.token, verificationToken.token)
            )
          )
          .returning()
          .get() ?? null) as Promise<VerificationToken | null>;
      } catch {
        throw new Error("No verification token found.");
      }
    },
    deleteUser: (id) => {
      return database.delete(users).where(eq(users.id, id)).returning().get();
    },
    unlinkAccount: (account) => {
      database
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .run();

      return undefined;
    },
  };
}
