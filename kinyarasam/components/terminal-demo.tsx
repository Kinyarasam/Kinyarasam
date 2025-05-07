"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function TerminalDemo() {
  const [text, setText] = useState("")
  const fullText =
    "const developer = {\n  name: 'Kinyara Samuel Gachigo',\n  skills: ['Software Engineering', 'Telecommunications'],\n  passion: 'Building innovative solutions'\n};"

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="bg-black/80 rounded-lg p-4 font-mono text-sm text-green-400 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-1 mb-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-xs text-gray-400">developer-profile.js</div>
      </div>
      <pre className="whitespace-pre-wrap">
        {text}
        <span className="animate-pulse">|</span>
      </pre>
    </motion.div>
  )
}
