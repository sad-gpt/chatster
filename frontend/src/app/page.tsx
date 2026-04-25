"use client"

import { useRouter } from "next/navigation"

export default function LandingPage() {

  const router = useRouter()

  return (

    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-700 text-white">

      <h1 className="text-5xl font-bold mb-6">
        Chatster 💬
      </h1>

      <p className="mb-10 text-lg">
        Talk to strangers around the world
      </p>

      <div className="flex flex-col gap-4 w-64">

        <button
          onClick={() => router.push("/login")}
          className="bg-black py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="bg-black py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push("/username")}
          className="bg-green-500 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Chat as Guest
        </button>

      </div>

    </main>

  )
}