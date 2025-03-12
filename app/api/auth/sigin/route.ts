import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { getSession } from '@/auth/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const { email, password } = await req.json();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      {
          email,
          password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.data && response.data.data) {
      const user = response.data.data;
      session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        accessToken: user.access_token,
        refreshToken: user.refresh_token,
        expiry: user.expires_in
      };

      await session.save();

      return NextResponse.json({ user: session.user });
    } else {
      return NextResponse.json({ error: "Invalid response from API" }, { status: 400 });
    }
  } catch (error) {
    console.error("Authorization error:", error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorData = axiosError.response.data as { errors?: string | string[] | Record<string, string[]> };
        let errorMessage: string;
        
        if (typeof errorData.errors === 'string') {
          errorMessage = errorData.errors;
        } else if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(', ');
        } else if (typeof errorData.errors === 'object') {
          errorMessage = Object.entries(errorData.errors)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('; ');
        } else {
          errorMessage = 'An unknown error occurred during authentication';
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: axiosError.response.status }
        );
      } else if (axiosError.request) {
        // The request was made but no response was received
        return NextResponse.json(
          { error: "No response received from server" },
          { status: 500 }
        );
      }
    }
    
    // For any other type of error
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
}