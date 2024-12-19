// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        router.back();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="mb-4">
        {error === 'AccessDenied' && 'You do not have permission to sign in.'}
        {error === 'Verification' && 'The verification failed.'}
        {!error && 'An unknown error occurred.'}
      </p>
      <p>You will be redirected back automatically...</p>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}