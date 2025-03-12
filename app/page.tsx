import { getServerSession } from '@/lib/server-session';
import LoginPage from "@/app/_sessions/login";
import { Suspense } from 'react';
import Loader from './_shared/loader';

export default async function Home() {
  const sessionData = await getServerSession();

  const Loading = () => (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
  return (
    <main className="font-sans bg-cream">
      <Suspense fallback={<Loading />}>
        {sessionData?.user ? (
          <p>test success</p>
        ) : (
          <LoginPage />
        )}
      </Suspense>
    </main>

  );
}
