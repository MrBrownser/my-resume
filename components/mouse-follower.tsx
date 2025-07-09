"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Pure function - declared outside component to avoid recreation on every render
const checkTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return true // SSR fallback
  
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  const cannotHover = window.matchMedia('(hover: none)').matches
  const hasTouchPoints = navigator.maxTouchPoints > 0
  const hasTouchStart = 'ontouchstart' in window
  
  // Device is considered touch if it has coarse pointer OR cannot hover OR has touch points
  return hasCoarsePointer || cannotHover || hasTouchPoints || hasTouchStart
}

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true) // Default to true for SSR

  useEffect(() => {
    setIsTouchDevice(checkTouchDevice())

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Don't render mouse follower on touch devices
  if (isTouchDevice) {
    return null
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
      >
        <div className="w-full h-full rounded-full bg-white opacity-50"></div>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 1,
          y: mousePosition.y - 1,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  )
}
