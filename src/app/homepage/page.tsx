'use client'

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { useRouter } from 'next/navigation';
import QuestionInput from './QuestionInput';

export default function Homepage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSolve = async () => {
    setIsLoading(true);
    setErrorMsg(null);

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

      const data = await response.json();

      if (response.ok) {
        router.push(`/solution?solution=${encodeURIComponent(data.solution)}`);
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while generating the solution. Please try again.');
      console.error(err);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white notebook-background">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <main className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-8 text-gray-800 font-bold text-center">DoubtSolve</h1>
          <div className="mb-8">
            <QuestionInput 
              question={question} 
              setQuestion={setQuestion} 
              image={image} 
              setImage={setImage}
              setInputType={setInputType}
            />
          </div>
          <div className="flex justify-center">
            <button 
              onClick={handleSolve}
              disabled={isLoading || (!question && !image)}
              className={`bg-black text-white px-8 py-2 rounded-full text-lg font-semibold transition-colors shadow-lg ${isLoading || (!question && !image) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              {isLoading ? 'Solving...' : 'Solve'}
            </button>
          </div>
          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {errorMsg && (
            <div className="mt-4 text-red-500 text-center">{errorMsg}</div>
          )}
        </main>
      </div>
      <style jsx global>{`
        .notebook-background {
          background-image:
            linear-gradient(#e5e5e5 1px, transparent 1px),
            linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}