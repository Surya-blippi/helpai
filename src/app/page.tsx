import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background relative overflow-hidden">
      {/* Background squares */}
      <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-foreground bg-opacity-10 rounded-lg"></div>
        ))}
      </div>
      
      {/* Content */}
      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold mb-8 text-foreground">DoubtSolve.</h1>
        <button className="bg-foreground text-background px-6 py-3 rounded-lg flex items-center hover:opacity-90 transition-opacity">
          <UserCircleIcon className="h-6 w-6 mr-2" />
          Sign in with Google
        </button>
      </div>
    </main>
  )
}