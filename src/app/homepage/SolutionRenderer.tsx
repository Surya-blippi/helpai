'use client'

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

interface SolutionRendererProps {
  solution: string;
}

const SolutionRenderer: React.FC<SolutionRendererProps> = ({ solution }) => {
  // Function to split the solution into text and math parts
  const renderLatex = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <Latex key={index}>{part}</Latex>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Function to parse and render the solution
  const renderSolution = () => {
    const sections = solution.split(/\n(?=Step \d+:|Solution:|Final Answer:)/);
    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n');
      const sectionContent = content.join('\n').trim();

      if (title.startsWith('Step')) {
        return (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="pl-4">{renderLatex(sectionContent)}</div>
          </div>
        );
      } else if (title === 'Solution:') {
        return (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div>{renderLatex(sectionContent)}</div>
          </div>
        );
      } else if (title === 'Final Answer:') {
        return (
          <div key={index} className="mt-4 p-4 bg-green-100 rounded">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div>{renderLatex(sectionContent)}</div>
          </div>
        );
      } else {
        return <div key={index}>{renderLatex(section)}</div>;
      }
    });
  };

  return (
    <div className="solution-container p-6 bg-white rounded-lg shadow-md solution-content">
      {renderSolution()}
    </div>
  );
};

export default SolutionRenderer;