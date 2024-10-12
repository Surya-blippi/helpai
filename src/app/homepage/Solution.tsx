import React from 'react';

interface SolutionProps {
  solution: string;
}

const Solution: React.FC<SolutionProps> = ({ solution }) => {
  console.log('Rendering Solution component');
  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Solution:</h2>
      <div className="whitespace-pre-wrap">{solution}</div>
    </div>
  );
};

export default Solution;