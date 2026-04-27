"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { io } from "socket.io-client"

export default function HomePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const userStr = sessionStorage.getItem("username") || localStorage.getItem("user")
    if (userStr) {
      try {
        const user = typeof userStr === "string" && userStr.startsWith("{") ? JSON.parse(userStr) : { username: userStr }
        setUsername(user.username || "Stranger")
      } catch (e) {
        setUsername("Stranger")
      }
    } else {
      router.push("/")
    }

    // Socket for online count
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050")
    socket.on("updateOnlineCount", (count: number) => {
      setOnlineCount(count)
    })

    return () => {
      socket.disconnect()
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-800 via-fuchsia-900 to-purple-950 flex flex-col items-center justify-center px-4">
      
      {/* Online Count (Top Right) */}
      <div className="fixed top-6 right-6 flex items-center gap-2 bg-pink-500/10 border border-pink-100/10 px-4 py-2 rounded-full backdrop-blur-sm">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <span className="text-pink-100 text-xs font-bold tracking-wide">
          {onlineCount} online
        </span>
      </div>

      {/* Logo Top Left (Clean, Large) */}
      <div className="fixed top-8 left-8">
        <div 
          onClick={() => router.push("/home")}
          className="group cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <Image src="/logo.png" alt="Chatster" width={80} height={80} className="rounded-2xl shadow-lg" />
        </div>
      </div>

      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-pink-50 tracking-tight">
            Welcome back, <span className="text-pink-300">{username}</span>!
          </h1>
          <p className="text-pink-200 text-xl font-medium">
            Talk to strangers. Stay anonymous.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button
            onClick={() => router.push("/chat")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-pink-50 font-bold text-lg hover:from-pink-600 hover:to-fuchsia-700 transition shadow-xl shadow-pink-900/40 active:scale-[0.98]"
          >
            Start Chatting
          </button>
          
          <button
            onClick={() => router.push("/username")}
            className="w-full py-3 rounded-2xl bg-pink-100/10 border border-pink-100/20 text-pink-100 font-semibold hover:bg-pink-100/20 transition backdrop-blur-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <p className="fixed bottom-8 text-pink-100/30 text-xs">
        Respect others. Stay safe.
      </p>
    </main>
  )
}
