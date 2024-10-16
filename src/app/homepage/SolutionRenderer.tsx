'use client'

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer: React.FC<SolutionRendererProps> = ({ solution }) => {
  // Function to split the solution into text and math parts
  const splitSolution = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <Latex key={index}>{part}</Latex>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="solution-container p-4 bg-white rounded shadow">
      {splitSolution(solution)}
    </div>
  );
};

export default SolutionRenderer;