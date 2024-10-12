'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function SolutionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const solution = searchParams.get('solution');

  return (
    <div className="min-h-screen bg-white notebook-background">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <main className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-8 text-gray-800 font-bold">Solution</h1>
          <div className="whitespace-pre-wrap">{solution}</div>
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