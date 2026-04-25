"use client"

import { useState } from "react"

export default function SafetyBanner() {
  const [showReport, setShowReport] = useState(false)
  const [reported, setReported] = useState(false)
  const [reason, setReason] = useState("")

  function submit() {
    setReported(true)
    setTimeout(() => {
      setShowReport(false)
      setReported(false)
      setReason("")
    }, 2000)
  }

  return (
    <>
      <div className="flex items-center gap-2 bg-pink-50 border-b border-pink-100 px-4 py-1.5">
        {/* Shield icon */}
        <svg
          className="w-3.5 h-3.5 text-pink-400 shrink-0"
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
        <p className="text-xs text-pink-600 flex-1">
          Stay anonymous — never share personal information with strangers.
        </p>
        <button
          onClick={() => setShowReport(true)}
          className="text-xs text-pink-400 hover:text-pink-600 font-medium transition shrink-0"
        >
          Report
        </button>
      </div>

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-4">
              <p className="text-white font-semibold">Report this user</p>
              <p className="text-pink-200 text-xs mt-0.5">
                Help keep Chatster safe for everyone
              </p>
            </div>

            {reported ? (
              <div className="px-6 py-8 text-center">
                <p className="text-green-600 font-semibold">Report submitted</p>
                <p className="text-gray-400 text-sm mt-1">Thank you for helping keep us safe.</p>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div className="space-y-2">
                  {["Harassment or threats", "Inappropriate content", "Spam or scam", "Underage user", "Other"].map(
                    opt => (
                      <label
                        key={opt}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={opt}
                          checked={reason === opt}
                          onChange={() => setReason(opt)}
                          className="accent-pink-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                          {opt}
                        </span>
                      </label>
                    )
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowReport(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!reason}
                    onClick={submit}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition"
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
