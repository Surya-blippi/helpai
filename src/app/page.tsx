'use client'

import { UserCircleIcon } from '@heroicons/react/24/solid'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/homepage');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white relative overflow-hidden graph-paper">
      {/* Background squares */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-12 gap-0">
        {[...Array(120)].map((_, i) => (
          <div key={i} className="border border-gray-200">
            <div className="w-full h-full bg-gray-100"></div>
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="z-10 text-center">
        <h1 className="text-4xl mb-8 text-black">
          <span className="font-normal">Doubt</span>
          <span className="font-bold">Solve</span>
        </h1>
        <button 
          onClick={signIn}
          className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition-colors"
        >
          <UserCircleIcon className="h-6 w-6 mr-2" />
          Sign in with Google
        </button>
      </div>
    </main>
  )
}