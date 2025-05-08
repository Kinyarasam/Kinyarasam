"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function SkillRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Add this near the top of the useEffect hook
    const checkMobile = () => {
      return window.innerWidth < 768
    }

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)

    }

    setCanvasDimensions()

    // Skills data
    const skills = [
      { name: "JavaScript", value: 0.9 },
      { name: "React", value: 0.85 },
      { name: "Node.js", value: 0.8 },
      { name: "Network Protocols", value: 0.75 },
      { name: "VoIP", value: 0.7 },
      { name: "Cloud", value: 0.65 },
      { name: "Python", value: 0.6 },
      { name: "5G", value: 0.55 },
      { name: "Backend", value: 0.9 },
      { name: "Devops", value: 0.9 },
      { name: "C", value: 0.7 },
    ]

    // Draw radar chart
    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scaleFactor = checkMobile() ? 7 : 2

      const centerX = canvas.width / scaleFactor
      const centerY = canvas.height / scaleFactor

      // Adjust radius for small screens
      const isMobile = window.innerWidth < 768
      const radius = Math.min(centerX, centerY) * (isMobile ? 0.65 : 0.8)

      // Draw circles
      const numCircles = 4
      for (let i = 1; i <= numCircles; i++) {
        const circleRadius = (radius / numCircles) * i

        ctx.beginPath()
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(99, 102, 241, 0.2)"
        ctx.stroke()
      }

      // Draw axes
      const numAxes = skills.length
      const angleStep = (Math.PI * 2) / numAxes

      // Responsive font size based on screen size
      const fontSize = Math.max(8, Math.min(10, canvas.width / 30))
      ctx.font = `${fontSize}px sans-serif`

      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"
        ctx.stroke()

        // Improved text positioning for mobile
        const textDistance = radius + (isMobile ? 15 : 10)
        const textX = centerX + Math.cos(angle) * textDistance
        const textY = centerY + Math.sin(angle) * textDistance

        // Adjust text alignment based on position to prevent cutoff
        if (Math.cos(angle) > 0.5) {
          ctx.textAlign = "left"
        } else if (Math.cos(angle) < -0.5) {
          ctx.textAlign = "right"
        } else {
          ctx.textAlign = "center"
        }

        ctx.fillStyle = "rgba(99, 102, 241, 0.8)"
        ctx.textBaseline = "middle"
        ctx.fillText(skills[i].name, textX, textY)
      }

      // Draw data
      ctx.beginPath()
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep
        const value = skills[i].value
        const pointX = centerX + Math.cos(angle) * radius * value
        const pointY = centerY + Math.sin(angle) * radius * value

        if (i === 0) {
          ctx.moveTo(pointX, pointY)
        } else {
          ctx.lineTo(pointX, pointY)
        }
      }
      ctx.closePath()
      ctx.fillStyle = "rgba(99, 102, 241, 0.2)"
      ctx.fill()
      ctx.strokeStyle = "rgba(99, 102, 241, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw points
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep
        const value = skills[i].value
        const pointX = centerX + Math.cos(angle) * radius * value
        const pointY = centerY + Math.sin(angle) * radius * value

        ctx.beginPath()
        ctx.arc(pointX, pointY, isMobile ? 3 : 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(99, 102, 241, 1)"
        ctx.fill()
      }
    }

    drawRadar()

    // Handle resize
    const handleResize = () => {
      setCanvasDimensions()
      drawRadar()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      className="w-full aspect-square max-w-[300px] sm:max-w-[300px] mx-auto px-2"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
