'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function SolutionContent() {
  const [solution, setSolution] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setSolution(searchParams.get('solution'));
  }, []);

  if (!solution) {
    return <div>Loading solution...</div>;
  }

  return (
    <div className="whitespace-pre-wrap break-words">{solution}</div>
  );
}

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div role="alert" className="text-red-500">
      <p>Error loading solution:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Try again</button>
    </div>
  )
}

export default function SolutionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white notebook-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <main className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-8 text-gray-800 font-bold">Solution</h1>
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => router.back()}>
            <Suspense fallback={<div>Loading...</div>}>
              <SolutionContent />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <style jsx global>{`
        .notebook-background {
          background-image:
            linear-gradient(#e5e5e5 1px, transparent 1px),
            linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}