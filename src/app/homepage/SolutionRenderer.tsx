'use client'

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import RehypeKatexPlugin from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer: React.FC<SolutionRendererProps> = ({ solution }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [solution]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="solution-container p-6 bg-white rounded-lg shadow-md solution-content">
      <ReactMarkdown
        remarkPlugins={[RemarkMathPlugin]}
        rehypePlugins={[RehypeKatexPlugin]}
        components={{
          h1: ({children}) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
          p: ({children}) => <p className="mb-4">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
          li: ({children}) => <li className="mb-1">{children}</li>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">{children}</blockquote>,
        }}
      >
        {solution}
      </ReactMarkdown>
    </div>
  );
};

export default SolutionRenderer;