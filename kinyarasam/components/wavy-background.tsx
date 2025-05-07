"use client"

import { useEffect, useRef } from "react"

export function WavyBackground({ className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation variables
    let time = 0
    const waves = 3
    const waveHeight = 20

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw waves
      for (let i = 0; i < waves; i++) {
        const opacity = 0.3 - i * 0.1
        const heightMultiplier = 1 - i * 0.2

        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x < canvas.width; x += 10) {
          const y = Math.sin(x * 0.01 + time + i) * waveHeight * heightMultiplier + canvas.height / 2
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`)
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity})`)
        gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity})`)

        ctx.fillStyle = gradient
        ctx.fill()
      }

      time += 0.01
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
