"use client"

import { useState, useEffect, useCallback } from "react"

interface TypingEffectProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenTexts?: number
}

export function TypingEffect({
  texts,
  typingSpeed = 101,
  deletingSpeed = 50,
  delayBetweenTexts = 1500,
}: TypingEffectProps) {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleTyping = useCallback(() => {
    const currentWord = texts[textIndex]
    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        setCurrentText((prev) => prev + currentWord.charAt(charIndex))
        setCharIndex((prev) => prev + 1)
      } else {
        setTimeout(() => setIsDeleting(true), delayBetweenTexts)
      }
    } else {
      if (charIndex > 0) {
        setCurrentText((prev) => prev.substring(0, prev.length - 1))
        setCharIndex((prev) => prev - 1)
      } else {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
      }
    }
  }, [charIndex, textIndex, isDeleting, texts, delayBetweenTexts])

  useEffect(() => {
    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed)
    return () => clearTimeout(timer)
  }, [handleTyping, isDeleting, typingSpeed, deletingSpeed])

  return (
    <span className="inline-block min-h-[1.5em] text-primary">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
