'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Helper function to render LaTeX
function renderLatex(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: displayMode,
    });
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return latex; // Return original string if rendering fails
  }
}

// Helper function to process the solution text
function processSolution(solution: string): string {
  // Replace inline LaTeX
  solution = solution.replace(/\$([^\$]+)\$/g, (match, latex) => renderLatex(latex));
  
  // Replace display LaTeX
  solution = solution.replace(/\$\$([^\$]+)\$\$/g, (match, latex) => renderLatex(latex, true));
  
  // Replace headers
  solution = solution.replace(/^###\s*(.*)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  
  // Replace bullet points
  solution = solution.replace(/^-\s*(.*)$/gm, '<li class="ml-6 mb-2">$1</li>');
  
  // Replace numbered lists (assuming they're formatted as "1. ", "2. ", etc.)
  solution = solution.replace(/^\d+\.\s*(.*)$/gm, '<li class="ml-6 mb-2">$1</li>');
  
  // Wrap remaining text in paragraphs
  solution = solution.replace(/^(?!<h3|<li)(.+)$/gm, '<p class="mb-4">$1</p>');
  
  return solution;
}

export default function SolutionPage() {
  const router = useRouter();
  const [processedSolution, setProcessedSolution] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const solution = searchParams.get('solution') || '';
    setProcessedSolution(processSolution(solution));
  }, []);

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
          <div 
            className="solution-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: processedSolution }}
          />
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