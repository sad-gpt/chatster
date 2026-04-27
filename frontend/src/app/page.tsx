"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AgeModal from "@/components/AgeModal"

import Image from "next/image"

export default function LandingPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    // 1. Check age verification
    const verified = localStorage.getItem("ageVerified")
    if (!verified) {
      setShowModal(true)
    }
  }, [router])

  function handleConfirm() {
    localStorage.setItem("ageVerified", "true")
    setShowModal(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-800 via-fuchsia-900 to-purple-950 flex flex-col items-center justify-center px-4">

      {showModal && <AgeModal onConfirm={handleConfirm} />}

      {/* Logo mark (Clean, Large) */}
      <div className="mb-10">
        <Image src="/logo.png" alt="Chatster" width={120} height={120} className="rounded-3xl shadow-2xl" priority />
      </div>

      <h1 className="text-5xl font-extrabold text-pink-50 tracking-tight mb-3">Chatster</h1>
      <p className="text-pink-200 text-xl mb-12 text-center max-w-xs font-semibold">
        Talk to strangers. Stay anonymous.
      </p>

      <div className="flex flex-col gap-4 w-72">
        <button
          onClick={() => router.push("/login")}
          disabled={!termsAccepted}
          className="w-full py-4 rounded-xl bg-pink-50 text-purple-950 font-bold text-base hover:bg-pink-100 transition shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Log In
        </button>

        <button
          onClick={() => router.push("/signup")}
          disabled={!termsAccepted}
          className="w-full py-4 rounded-xl bg-pink-100/10 border-2 border-pink-100/40 text-pink-50 font-bold text-base hover:bg-pink-100/20 transition backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>

        <div className="flex items-center gap-3 my-1">
          <span className="flex-1 h-px bg-pink-100/20" />
          <span className="text-pink-100/50 text-xs font-bold tracking-widest">OR</span>
          <span className="flex-1 h-px bg-pink-100/20" />
        </div>

        <button
          onClick={() => router.push("/username")}
          disabled={!termsAccepted}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-pink-50 font-bold text-base hover:from-pink-600 hover:to-fuchsia-700 transition shadow-2xl shadow-pink-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Chat as Guest
        </button>

        <div className="flex items-center gap-2 px-1 mt-6">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 rounded border-pink-300 text-pink-600 focus:ring-pink-400 accent-pink-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-pink-100 text-sm cursor-pointer select-none font-medium">
            I agree to the <button onClick={() => router.push("/terms")} className="underline hover:text-pink-50 decoration-2">Terms</button> & <button onClick={() => router.push("/privacy")} className="underline hover:text-pink-50 decoration-2">Privacy Policy</button>
          </label>
        </div>

        <p className="mt-8 text-pink-100 text-sm text-center font-bold leading-relaxed">
          Stay safe and respect others in the community.
        </p>
      </div>
    </main>
  )
}
