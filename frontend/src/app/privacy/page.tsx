import Link from "next/link"

export const metadata = {
  title: "Privacy Policy — Chatster",
}

const sections = [
  {
    title: "What we collect",
    body: "We collect very little. When you use Chatster, we may log basic connection data (IP address, connection timestamps) for security purposes only. This data is not linked to your identity and is not retained long-term. We do not require you to register or provide personal information to chat.",
  },
  {
    title: "What we do NOT collect",
    body: "We do not store, log, or retain any chat messages. Conversations are ephemeral — they exist only for the duration of your session and are never written to any database or file. Once you disconnect, the conversation is gone permanently.",
  },
  {
    title: "Cookies & local storage",
    body: "Chatster uses localStorage in your browser to remember your age verification preference so you are not shown the gate on every visit. We do not use tracking cookies or third-party analytics that identify you personally.",
  },
  {
    title: "No data sharing",
    body: "We do not sell, rent, or share your data with any third parties. We have no advertising partners. We do not use your usage patterns to build profiles or deliver targeted content.",
  },
  {
    title: "Third-party services",
    body: "Chatster does not embed third-party scripts, trackers, or analytics SDKs. The only external connection your browser makes is to our own backend server to enable the real-time chat functionality.",
  },
  {
    title: "Your rights",
    body: "Because we collect so little, there is little to request or delete. If you have concerns about any data that may have been retained for security purposes, contact us at support@chatster.app and we will address it promptly.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Chatster
          </Link>
          <Link href="/terms" className="text-pink-300 hover:text-white text-sm transition">
            Terms & Guidelines →
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-pink-300 text-sm mt-2">Last updated April 2026 · Short version: we barely collect anything.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/30 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />

          <div className="px-8 py-8 divide-y divide-gray-100">
            {sections.map((s, i) => (
              <div key={i} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full shrink-0" />
                  <h2 className="font-bold text-gray-800 text-base">{s.title}</h2>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-3.5">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Questions? support@chatster.app</p>
            <Link href="/terms" className="text-xs text-pink-500 hover:text-pink-600 font-medium transition">
              Terms & Guidelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
