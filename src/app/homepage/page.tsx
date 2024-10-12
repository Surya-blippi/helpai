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
    <div className="min-h-screen bg-white">
      <div className="notebook-background p-8">
        <main className="max-w-4xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-8 text-gray-800 font-bold">DoubtSolve</h1>
          <div className="mb-4">
            <QuestionInput 
              question={question} 
              setQuestion={setQuestion} 
              image={image} 
              setImage={setImage} 
            />
          </div>
          <button 
            onClick={handleSolve}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Solve
          </button>
        </main>
      </div>
    </div>
  );
}