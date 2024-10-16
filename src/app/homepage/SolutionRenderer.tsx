'use client'

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Explicitly import types
import { Components } from 'react-markdown';

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer: React.FC<SolutionRendererProps> = ({ solution }) => {
  // Explicitly declare the components object with types
  const components: Components = {
    math: ({ value }: { value: string }) => <BlockMath math={value || ''} />,
    inlineMath: ({ value }: { value: string }) => <InlineMath math={value || ''} />
  };

  return (
    <div className="solution-container p-4 bg-white rounded shadow">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {solution}
      </ReactMarkdown>
    </div>
  );
};

export default SolutionRenderer;