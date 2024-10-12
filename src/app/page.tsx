import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white relative overflow-hidden graph-paper">
      {/* Background squares */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-6 gap-0">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="border border-gray-200">
            <div className="w-full h-full bg-gray-100"></div>
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">DoubtSolve.</h1>
        <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition-colors">
          <UserCircleIcon className="h-6 w-6 mr-2" />
          Sign in with Google
        </button>
      </div>
    </main>
  )
}