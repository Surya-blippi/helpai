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
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />,
        }}
      >
        {solution}
      </ReactMarkdown>
    </div>
  );
};

export default SolutionRenderer;