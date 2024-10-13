'use client'

import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

type ComponentType = React.FC<{ children: ReactNode }>;

export default function SolutionPage() {
  const router = useRouter();
  const [solution, setSolution] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const solutionParam = searchParams.get('solution') || '';
    setSolution(decodeURIComponent(solutionParam));
  }, []);

  // Define the components with proper typing
  const components: { [key: string]: ComponentType } = {
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    p: ({ children }) => <p className="mb-4">{children}</p>,
    li: ({ children }) => <li className="ml-6 mb-2">{children}</li>,
  };

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
          <div className="solution-content prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={components}
            >
              {solution}
            </ReactMarkdown>
          </div>
        </main>
      </div>
      <style jsx global>{`
        .notebook-background {
          background-image:
            linear-gradient(#e5e5e5 1px, transparent 1px),
            linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .solution-content .katex-display {
          margin: 1rem 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
      `}</style>
    </div>
  );
}