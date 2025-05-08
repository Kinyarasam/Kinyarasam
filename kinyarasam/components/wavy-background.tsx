"use client"
import { useEffect, useRef } from "react"

export function WavyBackground({ className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0);
  let lastTime: number | null = null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const width = Math.ceil(window.innerWidth)
      const height = Math.ceil(canvas.clientHeight)
      
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    // Animation variables
    let time = 0
    const waves = 3

    const getWaveHeight = () => {
      // Make waves more pronounced on mobile
      return Math.min(30, window.innerWidth * 0.03)
    }

    const animate = (timestamp: number) => {
      if (!canvas) return
      
      // Calculate delta time for smooth animation
      const deltaTime = lastTime ? (timestamp - lastTime) / 1000 : 0.016
      lastTime = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const visibleWidth = canvas.width / (window.devicePixelRatio || 1)
      const visibleHeight = canvas.height / (window.devicePixelRatio || 1)

      // Adjust time increment based on deltaTime
      time += deltaTime * 0.5

      for (let i = 0; i < waves; i++) {
        const opacity = 0.3 - i * 0.1
        const heightMultiplier = 1 - i * 0.2
        const waveHeight = getWaveHeight()

        ctx.beginPath()
        ctx.moveTo(0, visibleHeight / 2)

        // Use fewer points on mobile for performance
        const step = window.innerWidth < 768 ? 20 : 10
        
        for (let x = 0; x <= visibleWidth; x += step) {
          const y = Math.sin(x * 0.01 + time + i) * waveHeight * heightMultiplier + 
                   (visibleHeight / 2)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(visibleWidth, visibleHeight)
        ctx.lineTo(0, visibleHeight)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, 0, visibleWidth, 0)
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`)
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity})`)
        gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity})`)

        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    setCanvasDimensions()
    animationRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      setCanvasDimensions()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  )
}
