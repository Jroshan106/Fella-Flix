import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // HIGHLY SECURE: Password is now strictly loaded from environment variables.
    // Make sure to set ADMIN_PASSWORD in your Vercel dashboard or .env file!
    const validUser = 'admin';
    const validPassword = process.env.ADMIN_PASSWORD;

    // If no password is set in the environment, we block all access to be safe.
    if (!validPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set!");
    } else if (user === validUser && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
