"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { io, Socket } from "socket.io-client"
import SafetyBanner from "@/components/SafetyBanner"

interface Message {
  text: string
  from: "me" | "them" | "system"
}

export default function ChatPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"connecting" | "waiting" | "chatting">("connecting")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function joinQueue(socket: Socket) {
    const username = sessionStorage.getItem("username") || "Guest"
    const gender = sessionStorage.getItem("gender") || "any"
    const preference = sessionStorage.getItem("preference") || "any"
    socket.emit("match_user", {
      username,
      gender: gender === "any" ? null : gender,
      preference: preference === "any" ? null : preference,
    })
  }

  useEffect(() => {
    const socket = io("http://localhost:5050")
    socketRef.current = socket

    socket.on("connect", () => {
      setStatus("waiting")
      joinQueue(socket)
    })

    socket.on("matched", ({ username: pName }: { username: string }) => {
      setPartnerName(pName)
      setStatus("chatting")
      setMessages([{ text: `You are now chatting with ${pName}`, from: "system" }])
    })

    socket.on("receive_message", (msg: string) => {
      setIsTyping(false)
      setMessages(prev => [...prev, { text: msg, from: "them" }])
    })

    socket.on("show_typing", () => {
      setIsTyping(true)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function send() {
    const text = input.trim()
    if (!text || !socketRef.current) return
    socketRef.current.emit("send_message", text)
    setMessages(prev => [...prev, { text, from: "me" }])
    setInput("")
  }

  function handleInputChange(val: string) {
    setInput(val)
    socketRef.current?.emit("typing")
  }

  function skip() {
    if (!socketRef.current) return
    socketRef.current.emit("skip")
    setMessages([])
    setPartnerName("")
    setStatus("waiting")
    joinQueue(socketRef.current)
  }

  /* ── Connecting ── */
  if (status === "connecting") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-100/30 border-t-pink-50 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-pink-100/70 text-sm">Connecting...</p>
        </div>
      </div>
    )
  }

  /* ── Waiting for match ── */
  if (status === "waiting") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 gap-4 px-4">
        <div className="bg-pink-100/10 border border-pink-100/15 rounded-3xl p-10 text-center backdrop-blur-sm shadow-2xl">
          <div className="w-12 h-12 border-4 border-pink-300/40 border-t-pink-50 rounded-full animate-spin mx-auto mb-5" />
          <p className="text-pink-50 font-semibold text-lg">Finding someone for you</p>
          <p className="text-pink-200 text-sm mt-1 mb-6">This usually takes just a few seconds</p>
          <button
            onClick={() => router.push("/")}
            className="text-pink-100/50 hover:text-pink-50 text-sm transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  /* ── Chatting ── */
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-900 via-fuchsia-950 to-purple-950">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-purple-900/40 border-b border-pink-500/20 shadow-sm backdrop-blur-md">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0">
          <span className="text-pink-50 text-sm font-bold">
            {partnerName.charAt(0).toUpperCase() || "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-pink-100 text-sm truncate">{partnerName || "Stranger"}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <p className="text-xs text-pink-400">Connected</p>
          </div>
        </div>
        <button
          onClick={skip}
          className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold hover:bg-pink-500 hover:text-pink-50 transition"
        >
          Skip
        </button>
      </div>

      {/* Safety banner + report */}
      <SafetyBanner />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        {messages.map((msg, i) => {
          if (msg.from === "system") {
            return (
              <div key={i} className="flex items-center gap-3 my-2">
                <span className="flex-1 h-px bg-pink-500/20" />
                <p className="text-xs text-pink-400 font-medium shrink-0">{msg.text}</p>
                <span className="flex-1 h-px bg-pink-500/20" />
              </div>
            )
          }
          return (
            <div
              key={i}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                  msg.from === "me"
                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-pink-50 rounded-br-sm shadow-md shadow-pink-900/30"
                    : "bg-purple-800/40 text-pink-100 border border-pink-500/10 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-purple-800/40 border border-pink-500/10 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-purple-900/40 border-t border-pink-500/20 backdrop-blur-md">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Say something..."
            className="flex-1 border border-pink-500/20 bg-pink-100/5 rounded-full px-5 py-2.5 text-sm text-pink-50 placeholder:text-pink-300/30 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-pink-50 px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md shadow-pink-900/30"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
