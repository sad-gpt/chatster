"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) return
    setError("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ 
          username: data.username, 
          gender: data.gender, 
          preference: data.preference,
          userId: data.userId
        }))

        // Sync with session storage for matchmaking
        if (data.username) sessionStorage.setItem("username", data.username)
        if (data.gender) sessionStorage.setItem("gender", data.gender)
        if (data.preference) sessionStorage.setItem("preference", data.preference)

        // If gender/preference are missing, collect them, otherwise go to chat
        if (!data.gender || !data.preference || data.gender === "any") {
          router.push("/username")
        } else {
          router.push("/chat")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Server connection failed")
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-pink-50">Welcome back</h1>
            <p className="text-pink-200 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="px-8 py-7 space-y-4">
            {error && (
              <p className="bg-red-100 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-200">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-pink-200 bg-pink-100/40 rounded-xl px-4 py-3 text-sm text-purple-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full border border-pink-200 bg-pink-100/40 rounded-xl px-4 py-3 text-sm text-purple-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-pink-50 font-semibold py-3 rounded-xl shadow-md shadow-pink-200/50 transition mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-sm text-purple-400 pt-1">
              No account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-pink-600 hover:text-pink-700 font-semibold transition"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
