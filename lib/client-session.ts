import { SessionData } from '@/auth/auth';

export async function getClientSession(): Promise<SessionData | null> {
  try {
    const response = await fetch('/api/auth/session', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        // No session found, return null instead of throwing an error
        return null;
      }
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data && data.user) {
      const currentTime = new Date();
      const expiryTime = new Date((Number(data.user.expiry)-300) * 1000);

      if (currentTime > expiryTime) {
        return null; 
      }
      return data as SessionData | null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}