"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { io, Socket } from "socket.io-client"
import SafetyBanner from "@/components/SafetyBanner"

import Image from "next/image"

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
  const [onlineCount, setOnlineCount] = useState(0)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function joinQueue(socket: Socket) {
    // Priority: SessionStorage -> LocalStorage -> Guest
    let username = sessionStorage.getItem("username")
    let gender = sessionStorage.getItem("gender")
    let preference = sessionStorage.getItem("preference")

    if (!username) {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          username = user.username
          gender = user.gender
          preference = user.preference
        } catch (e) { /* ignore */ }
      }
    }

    socket.emit("match_user", {
      username: username || "Guest",
      gender: (!gender || gender === "any") ? null : gender,
      preference: (!preference || preference === "any") ? null : preference,
    })
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050")
    socketRef.current = socket

    socket.on("connect", () => {
      setStatus("waiting")
      joinQueue(socket)
    })

    socket.on("updateOnlineCount", (count: number) => {
      setOnlineCount(count)
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
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-800 via-fuchsia-900 to-purple-950 gap-4 px-4">

        {/* Online Count (Top Right) */}
        <div className="fixed top-6 right-6 flex items-center gap-2 bg-pink-500/10 border border-pink-100/10 px-4 py-2 rounded-full backdrop-blur-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-pink-100 text-xs font-bold tracking-wide">
            {onlineCount} online
          </span>
        </div>

        {/* Logo Top Left (Clean, Large) */}
        <div className="fixed top-8 left-8">
          <div 
            onClick={() => router.push("/home")}
            className="group cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Image src="/logo.png" alt="Chatster" width={80} height={80} className="rounded-2xl shadow-lg" />
          </div>
        </div>

        <div className="bg-pink-100/10 border border-pink-100/15 rounded-3xl p-10 text-center backdrop-blur-sm shadow-2xl">
          <div className="w-12 h-12 border-4 border-pink-300/40 border-t-pink-50 rounded-full animate-spin mx-auto mb-5" />
          <p className="text-pink-50 font-semibold text-xl tracking-tight">Finding someone for you</p>
          <p className="text-pink-200 text-base mt-2 mb-8 font-medium italic">Talk to strangers. Stay anonymous.</p>
          <button
            onClick={() => router.push("/home")}
            className="text-pink-100 hover:text-pink-50 text-sm font-bold transition underline underline-offset-4 decoration-2"
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
      <div className="flex items-center gap-4 px-6 py-4 bg-purple-900/60 border-b border-pink-500/20 shadow-lg backdrop-blur-xl relative z-10">

        {/* Logo (Clean, Large - Matching Home) */}
        <div 
          onClick={() => router.push("/home")}
          className="cursor-pointer hover:scale-105 active:scale-95 transition-transform mr-4 shrink-0"
        >
          <Image src="/logo.png" alt="Chatster" width={80} height={80} className="rounded-2xl shadow-xl" />
        </div>

        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0 border-2 border-pink-100/20 shadow-inner">
          <span className="text-pink-50 text-base font-extrabold">
            {partnerName.charAt(0).toUpperCase() || "?"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-pink-50 text-sm truncate tracking-tight">{partnerName || "Stranger"}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
            <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Connected</p>
          </div>
        </div>

        {/* Online Count in Header */}
        <div className="hidden sm:flex items-center gap-2 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-100/5 mr-2">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-pink-100 text-[10px] font-bold uppercase tracking-tighter">
            {onlineCount} LIVE
          </span>
        </div>

        <button
          onClick={skip}
          className="px-6 py-2 rounded-full bg-pink-500 text-pink-50 text-xs font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-900/40 active:scale-95"
        >
          Skip
        </button>
      </div>


      <SafetyBanner />

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
