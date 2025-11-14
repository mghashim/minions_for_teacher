import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from '../prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Email login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'teacher@example.com' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email.toLowerCase();
        const name = credentials.name?.trim() || 'Teacher';

        const teacher = await prisma.teacher.upsert({
          where: { email },
          update: { name },
          create: {
            email,
            name,
            authProvider: 'magic_link_stub',
          },
        });

        return { id: teacher.id, email: teacher.email, name: teacher.name };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          id: token.sub,
          name: session.user?.name ?? undefined,
          email: session.user?.email ?? undefined,
        } as typeof session.user & { id: string };
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
};
