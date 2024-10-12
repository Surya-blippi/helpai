'use client'

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { useRouter } from 'next/navigation';
import QuestionInput from './QuestionInput';

export default function Homepage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSolve = async () => {
    // Here you would typically send the question and/or image to your backend for processing
    console.log('Question:', question);
    console.log('Image:', image);
    // Add your solve logic here
  };

  if (!isClient) {
    return null; // or a loading indicator
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-white notebook-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <main className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-6 text-gray-800 font-bold text-center">DoubtSolve</h1>
          <div className="mb-6">
            <QuestionInput 
              question={question} 
              setQuestion={setQuestion} 
              image={image} 
              setImage={setImage} 
            />
          </div>
          <button 
            onClick={handleSolve}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
          >
            Solve
          </button>
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