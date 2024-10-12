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
    <main className="flex min-h-screen flex-col items-center justify-start p-24 bg-white">
      <h1 className="text-3xl mb-8 text-black">Welcome, {user.displayName}!</h1>
      <QuestionInput 
        question={question} 
        setQuestion={setQuestion} 
        image={image} 
        setImage={setImage} 
        onSubmit={handleSubmit}
      />
      <button 
        onClick={handleSignOut}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-8"
      >
        Sign Out
      </button>
    </main>
  );
}