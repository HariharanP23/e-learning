import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from '@/auth/auth';

export async function getServerSession(): Promise<SessionData | null> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (session.user) {
    const currentTime = new Date();
    const expiryTime = new Date((Number(session.user.expiry)-300) * 1000); // Convert Unix timestamp to Date object

    if (currentTime > expiryTime) {
      return null; // Session expired
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        accessToken: session.user.accessToken,
        refreshToken: session.user.refreshToken,
        expiry: session.user.expiry
      }
    };
  }

  return null;
}