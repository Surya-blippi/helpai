'use client'

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let accumulatedSolution = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              accumulatedSolution += data.chunk;
              setSolution(accumulatedSolution);
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
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
    <div className="min-h-screen bg-gray-100">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] bg-[length:20px_20px]" />
      <div className="relative z-10 max-w-4xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="font-normal">Doubt</span>
                <span className="font-bold">Solve.</span>
              </h1>
            </div>
            <div className="border-t border-gray-200 pt-6">
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
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Solving...
                  </>
                ) : 'Solve'}
              </button>
              {error && (
                <div className="mt-2 text-red-600 bg-red-100 border border-red-400 rounded-md p-3">
                  Error: {error}
                </div>
              )}
              {solution && (
                <SolutionRenderer solution={solution} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}