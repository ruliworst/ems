import "@/config/container"
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { container } from 'tsyringe';
import { BaseOperatorService } from '@/src/domain/services/operators/BaseOperatorService';

const baseOperatorService = container.resolve(BaseOperatorService);

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const operator = await baseOperatorService.login(credentials?.email as string, credentials?.password as string);
        return operator ?? null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };