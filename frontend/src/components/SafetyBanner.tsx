"use client"

import { useState } from "react"

export default function SafetyBanner() {
  const [showReport, setShowReport] = useState(false)
  const [reported, setReported] = useState(false)
  const [reasons, setReasons] = useState<string[]>([])

  const options = [
    "Harassment or threats",
    "Inappropriate content",
    "Spam or scam",
    "Underage user",
    "Toxic behavior",
    "Other"
  ]

  function toggleReason(opt: string) {
    setReasons(prev => 
      prev.includes(opt) ? prev.filter(r => r !== opt) : [...prev, opt]
    )
  }

  function submit() {
    setReported(true)
    setTimeout(() => {
      setShowReport(false)
      setReported(false)
      setReasons([])
    }, 2000)
  }

  return (
    <>
      <div className="flex items-center gap-2 bg-purple-950/40 border-b border-pink-500/10 px-4 py-2 backdrop-blur-md">
        {/* Shield icon */}
        <svg
          className="w-4 h-4 text-pink-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <p className="text-xs text-pink-100/70 flex-1 font-medium italic">
          Stay anonymous — never share personal info with strangers.
        </p>
        <button
          onClick={() => setShowReport(true)}
          className="text-xs bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full border border-pink-500/20 font-bold transition shrink-0"
        >
          Report User
        </button>
      </div>

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-950/80 backdrop-blur-md px-4">
          <div className="bg-purple-900 border border-pink-500/30 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-8 py-6">
              <p className="text-2xl font-bold text-pink-50 tracking-tight">Report User</p>
              <p className="text-pink-200 text-sm mt-1">
                Help keep the community safe
              </p>
            </div>

            {reported ? (
              <div className="px-8 py-10 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-pink-50 font-bold text-lg">Report Submitted</p>
                <p className="text-pink-200/60 text-sm mt-1">We&apos;ll review this interaction immediately.</p>
              </div>
            ) : (
              <div className="px-8 py-7 space-y-6">
                <div className="grid grid-cols-1 gap-2.5">
                  {options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleReason(opt)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                        reasons.includes(opt)
                          ? "bg-pink-500/20 border-pink-500 text-pink-50 shadow-lg shadow-pink-900/20"
                          : "bg-pink-100/5 border-pink-100/10 text-pink-100/60 hover:bg-pink-100/10"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        reasons.includes(opt) ? "bg-pink-500 border-pink-500" : "border-pink-100/20"
                      }`}>
                        {reasons.includes(opt) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-semibold">{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowReport(false)}
                    className="flex-1 py-3.5 rounded-xl border border-pink-100/10 text-sm font-bold text-pink-100/50 hover:bg-pink-100/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={reasons.length === 0}
                    onClick={submit}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-pink-50 text-sm font-bold shadow-xl shadow-pink-900/40 disabled:opacity-30 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition active:scale-95"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
