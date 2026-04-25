"use client"

import { useState } from "react"
import Link from "next/link"

interface Props {
  onConfirm: () => void
}

export default function AgeModal({ onConfirm }: Props) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-8 py-7">
          <p className="text-2xl font-bold text-white tracking-tight">Chatster</p>
          <p className="text-pink-200 text-sm mt-1">
            A quick note before you dive in
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Please read before continuing
          </h3>

          <ul className="space-y-3 mb-7">
            <li className="flex gap-3 items-start">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                1
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                This platform is intended for users aged{" "}
                <strong className="text-gray-800">18 and above.</strong> Access
                by minors is strictly prohibited.
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                2
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                Do <strong className="text-gray-800">not</strong> share
                personal, sensitive, or financial information with strangers.
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                You are solely responsible for your own interactions on this
                platform.
              </p>
            </li>
          </ul>

          {/* Checkbox */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-pink-600 shrink-0 cursor-pointer"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              I confirm I am 18+ and agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-2"
              >
                Terms & Community Guidelines
              </Link>
            </span>
          </label>

          {/* CTA */}
          <button
            disabled={!checked}
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-pink-300/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Continue to Chatster
          </button>
        </div>
      </div>
    </div>
  )
}
