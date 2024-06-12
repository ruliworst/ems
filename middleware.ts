export { default } from 'next-auth/middleware';

export const config = { matcher: ['/devices/:path*', '/register/:path*', '/reports/:path*', '/tasks/:path*'] };
