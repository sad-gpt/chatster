"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UsernamePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [gender, setGender] = useState("any")
  const [preference, setPreference] = useState("any")

  function start() {
    const name = username.trim()
    if (!name) return
    sessionStorage.setItem("username", name)
    sessionStorage.setItem("gender", gender)
    sessionStorage.setItem("preference", preference)
    router.push("/chat")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-pink-100/60 hover:text-pink-50 text-sm mb-6 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <div className="bg-pink-50 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/30">
          <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-pink-50">Guest Setup</h1>
            <p className="text-pink-200 text-sm mt-1">
              Pick a name and who you&apos;d like to meet
            </p>
          </div>

          <div className="px-8 py-7 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Your nickname
              </label>
              <input
                type="text"
                placeholder="e.g. Alex, Sam, Nova..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && start()}
                maxLength={24}
                className="w-full border border-pink-200 bg-pink-100/40 rounded-xl px-4 py-3 text-sm text-purple-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                I am
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full border border-pink-200 bg-pink-100/40 rounded-xl px-4 py-3 text-sm text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition appearance-none cursor-pointer"
              >
                <option value="any">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Looking to meet
              </label>
              <select
                value={preference}
                onChange={e => setPreference(e.target.value)}
                className="w-full border border-pink-200 bg-pink-100/40 rounded-xl px-4 py-3 text-sm text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition appearance-none cursor-pointer"
              >
                <option value="any">Anyone</option>
                <option value="male">Males</option>
                <option value="female">Females</option>
              </select>
            </div>

            <button
              onClick={start}
              disabled={!username.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-pink-50 font-semibold py-3 rounded-xl shadow-md shadow-pink-200/50 transition mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
