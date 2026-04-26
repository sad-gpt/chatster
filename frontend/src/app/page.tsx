"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AgeModal from "@/components/AgeModal"

export default function LandingPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem("ageVerified")
    if (!verified) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowModal(true)
    }
  }, [])

  function handleConfirm() {
    localStorage.setItem("ageVerified", "true")
    setShowModal(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 flex flex-col items-center justify-center px-4">

      {showModal && <AgeModal onConfirm={handleConfirm} />}

      {/* Logo mark */}
      <div className="mb-2 w-14 h-14 rounded-2xl bg-pink-100/15 border border-pink-100/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
        <svg className="w-7 h-7 text-pink-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>

      <h1 className="text-5xl font-bold text-pink-50 tracking-tight mb-2">Chatster</h1>
      <p className="text-pink-200 text-base mb-10 text-center max-w-xs">
        Real conversations with real strangers — anonymous, fun, and safe.
      </p>

      <div className="flex flex-col gap-3 w-72">
        <div className="flex items-center gap-2 px-1 mb-4">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 rounded border-pink-300 text-pink-600 focus:ring-pink-400 accent-pink-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-pink-100 text-xs cursor-pointer select-none">
            I agree to the <button onClick={() => router.push("/terms")} className="underline hover:text-pink-50">Terms</button> & <button onClick={() => router.push("/privacy")} className="underline hover:text-pink-50">Privacy Policy</button>
          </label>
        </div>

        <button
          onClick={() => router.push("/login")}
          disabled={!termsAccepted}
          className="w-full py-3.5 rounded-xl bg-pink-100 text-pink-700 font-semibold text-sm hover:bg-pink-200 transition shadow-md shadow-black/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Log In
        </button>

        <button
          onClick={() => router.push("/signup")}
          disabled={!termsAccepted}
          className="w-full py-3.5 rounded-xl bg-pink-100/15 border border-pink-100/25 text-pink-50 font-semibold text-sm hover:bg-pink-100/25 transition backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>

        <div className="flex items-center gap-3 my-1">
          <span className="flex-1 h-px bg-pink-100/20" />
          <span className="text-pink-100/40 text-xs">or</span>
          <span className="flex-1 h-px bg-pink-100/20" />
        </div>

        <button
          onClick={() => router.push("/username")}
          disabled={!termsAccepted}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-400 to-fuchsia-500 text-pink-50 font-semibold text-sm hover:from-pink-500 hover:from-fuchsia-600 transition shadow-md shadow-pink-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Chat as Guest
        </button>
      </div>

      <p className="mt-10 text-pink-100/30 text-xs text-center">
        Stay safe and respect others in the community.
      </p>
    </main>
  )
}
