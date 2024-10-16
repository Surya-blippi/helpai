'use client'

import React, { useState, useEffect } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer: React.FC<SolutionRendererProps> = ({ solution }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to ensure KaTeX has time to render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [solution]);

  const renderLatex = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <Latex key={index}>{part}</Latex>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderSolution = () => {
    const sections = solution.split(/\n(?=Step \d+:|Solution:|Final Answer:)/);
    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n');
      const sectionContent = content.join('\n').trim();

      if (title.startsWith('Step')) {
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">{title}</h3>
            <div className="pl-4 text-gray-700">{renderLatex(sectionContent)}</div>
          </div>
        );
      } else if (title === 'Solution:') {
        return (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-3">{title}</h2>
            <div className="text-gray-700">{renderLatex(sectionContent)}</div>
          </div>
        );
      } else if (title === 'Final Answer:') {
        return (
          <div key={index} className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
            <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
            <div className="text-gray-800">{renderLatex(sectionContent)}</div>
          </div>
        );
      } else {
        return <div key={index} className="mb-4 text-gray-700">{renderLatex(section)}</div>;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="solution-container p-6 bg-white rounded-lg shadow-md solution-content">
      {renderSolution()}
    </div>
  );
};

export default SolutionRenderer;