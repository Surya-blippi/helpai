'use client'

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Script from 'next/script';

interface SolutionRendererProps {
  solution: string;
}

const MathJax = ({ math, inline }: { math: string; inline: boolean }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: inline
          ? `\\(${math}\\)`
          : `\\[${math}\\]`,
      }}
    />
  );
};

const SolutionRenderer: React.FC<SolutionRendererProps> = ({ solution }) => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
        integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"
        integrity="sha384-X/XCfMm41VSsqRNQgDerQczD69XqmjOOOwYQvr/uuC+j4OPoNhVgjdGFwhvN02Ja"
        crossOrigin="anonymous"
      />
      <div className="solution-container p-6 bg-white rounded-lg shadow-md solution-content">
        <ReactMarkdown
          className="solution-content prose prose-sm max-w-none"
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p className="mb-4">{children}</p>,
            h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ inline, children }) => 
              inline ? 
                <MathJax math={children[0] as string} inline={true} /> :
                <MathJax math={children[0] as string} inline={false} />,
          }}
        >
          {solution}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default SolutionRenderer;