'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Suspense, useEffect, useState, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic';
import 'katex/dist/katex.min.css';

const InlineMath = dynamic(() => import('react-katex').then((mod) => mod.InlineMath), { ssr: false });
const BlockMath = dynamic(() => import('react-katex').then((mod) => mod.BlockMath), { ssr: false });

function formatSolution(solution: string): ReactNode[] {
  const lines = solution.split('\n');
  return lines.map((line, index) => {
    // Handle headers
    if (line.startsWith('###')) {
      return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{line.replace('###', '').trim()}</h3>;
    }
    
    // Handle bullet points
    if (line.trim().startsWith('-')) {
      return <li key={index} className="ml-6 mb-2">{formatLine(line.replace('-', '').trim())}</li>;
    }
    
    // Handle numbered lists
    if (/^\d+\./.test(line)) {
      return <li key={index} className="ml-6 mb-2">{formatLine(line.replace(/^\d+\./, '').trim())}</li>;
    }
    
    // Handle block equations
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
      return <BlockMath key={index}>{line.trim().slice(2, -2)}</BlockMath>;
    }
    
    // Handle regular paragraphs
    return <p key={index} className="mb-4">{formatLine(line)}</p>;
  });
}

function formatLine(line: string): ReactNode[] {
  const parts = line.split(/(\$.*?\$|\\\(.*?\\\)|(\*\*.*?\*\*))/g);
  return parts.map((part, index) => {
    if (part?.startsWith('$') && part?.endsWith('$')) {
      return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
    }
    if (part?.startsWith('\\(') && part?.endsWith('\\)')) {
      return <InlineMath key={index}>{part.slice(2, -2)}</InlineMath>;
    }
    if (part?.startsWith('**') && part?.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

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
    <div className="space-y-4">
      {formatSolution(solution)}
    </div>
  );
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({error, resetErrorBoundary}: ErrorFallbackProps) {
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
              <div className="solution-content prose prose-lg max-w-none">
                <SolutionContent />
              </div>
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
        .solution-content h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .solution-content p {
          margin-bottom: 1rem;
        }
        .solution-content .katex-display {
          margin: 1rem 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .solution-content ul, .solution-content ol {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}