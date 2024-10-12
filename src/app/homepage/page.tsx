'use client'

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
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

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/');
    }).catch((error) => {
      console.error("Error signing out", error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the question and/or image to your backend for processing
    console.log('Question:', question);
    console.log('Image:', image);
    // Reset the form
    setQuestion('');
    setImage(null);
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
          <h1 className="text-3xl mb-8 text-gray-800 font-bold">Welcome, {user.displayName}!</h1>
          <QuestionInput 
            question={question} 
            setQuestion={setQuestion} 
            image={image} 
            setImage={setImage} 
            onSubmit={handleSubmit}
          />
          <button 
            onClick={handleSignOut}
            className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </main>
      </div>
      <style jsx>{`
        .notebook-background {
          background-image:
            linear-gradient(90deg, transparent 39px, #e0e0e0 39px, #e0e0e0 41px, transparent 41px),
            linear-gradient(#eee .1em, transparent .1em);
          background-size: 100% 1.2em;
        }
      `}</style>
    </div>
  );
}