'use client'

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Homepage() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/');
    }).catch((error) => {
      console.error("Error signing out", error);
    });
  };

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-3xl mb-8 text-black">Welcome, {user.displayName}!</h1>
      <button 
        onClick={handleSignOut}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Sign Out
      </button>
    </main>
  );
}