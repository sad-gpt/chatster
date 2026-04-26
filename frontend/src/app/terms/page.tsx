import Link from "next/link"

export const metadata = {
  title: "Terms & Community Guidelines — Chatster",
}

const sections = [
  {
    title: "Acceptable Use",
    body: "Chatster is a platform for casual, anonymous conversation between adults. You may use it to meet new people, have genuine conversations, and explore different perspectives. You agree to interact respectfully and honestly.",
  },
  {
    title: "Prohibited Behavior",
    body: "The following are strictly not allowed on Chatster: harassment, threats, or intimidation of any kind; sharing or soliciting explicit content involving minors; scamming, phishing, or attempting to defraud other users; impersonating another person or organisation; sharing illegal content or promoting illegal activity; and spam or automated messaging of any kind.",
  },
  {
    title: "No Data Storage Guarantee",
    body: "Chatster does not store your chat messages. Conversations are routed in real time and discarded the moment the connection ends. We have no record of what was said. This also means we cannot recover or provide transcripts of past conversations.",
  },
  {
    title: "User Responsibility",
    body: "You are fully responsible for what you say and share on Chatster. Use good judgement. Never share your full name, address, phone number, financial details, or any information that could put you at risk. If you feel unsafe in a conversation, disconnect immediately.",
  },
  {
    title: "Age Requirement",
    body: "You must be 18 years of age or older to use Chatster. By continuing past the age verification gate you confirm that you meet this requirement. If we have reason to believe a user is under 18, access will be revoked.",
  },
  {
    title: "Disclaimer of Liability",
    body: "Chatster is provided as-is with no guarantees. We are not responsible for the behaviour of other users, the content of conversations, or any harm that results from interactions on the platform. Use Chatster at your own discretion and risk.",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-pink-100/60 hover:text-pink-50 text-sm transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Chatster
          </Link>
          <Link href="/privacy" className="text-pink-300 hover:text-pink-100 text-sm transition">
            Privacy Policy →
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-50">Terms & Community Guidelines</h1>
          <p className="text-pink-300 text-sm mt-2">Last updated April 2026 · Applies to all users</p>
        </div>

        {/* Card */}
        <div className="bg-pink-50 rounded-3xl shadow-2xl shadow-purple-900/30 overflow-hidden">
          {/* Card top accent */}
          <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />

          <div className="px-8 py-8 divide-y divide-pink-100 space-y-0">
            {sections.map((s, i) => (
              <div key={i} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full shrink-0" />
                  <h2 className="font-bold text-purple-900 text-base">{s.title}</h2>
                </div>
                <p className="text-sm text-purple-800/70 leading-relaxed pl-3.5">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-pink-100/50 border-t border-pink-100 px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-purple-400">Questions? Contact us at support@chatster.app</p>
            <Link href="/privacy" className="text-xs text-pink-500 hover:text-pink-600 font-medium transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
