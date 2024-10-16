'use client'

import React, { useState } from 'react';
import QuestionInput from './QuestionInput';
import SolutionRenderer from './SolutionRenderer';

export default function Homepage() {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async () => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      let imageBase64 = '';
      if (image) {
        imageBase64 = await fileToBase64(image);
      }

      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputType,
          question,
          imageBase64,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSolution(data.solution);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error in handleSolve:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject('Failed to convert file to base64');
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-extrabold text-gray-900">DoubtSolve</h2>
                <QuestionInput
                  question={question}
                  setQuestion={setQuestion}
                  image={image}
                  setImage={setImage}
                  setInputType={setInputType}
                />
                <button
                  onClick={handleSolve}
                  disabled={isLoading || (!question && !image)}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading || (!question && !image) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Solving...' : 'Solve'}
                </button>
                {error && (
                  <div className="mt-2 text-red-600">
                    Error: {error}
                  </div>
                )}
                {solution && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Solution:</h3>
                    <SolutionRenderer solution={solution} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}