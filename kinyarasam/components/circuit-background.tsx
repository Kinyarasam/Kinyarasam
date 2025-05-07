"use client"

import { useEffect, useRef } from "react"

export function CircuitBackground({ className = "" }) {
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

    // Draw circuit pattern
    const drawCircuit = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gridSize = 50
      const lineWidth = 1

      ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"
      ctx.lineWidth = lineWidth

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw circuit elements
      const numElements = 100

      for (let i = 0; i < numElements; i++) {
        const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize
        const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize

        const elementType = Math.floor(Math.random() * 4)

        switch (elementType) {
          case 0: // Circle
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(99, 102, 241, 0.5)"
            ctx.fill()
            break
          case 1: // Square
            ctx.fillStyle = "rgba(99, 102, 241, 0.5)"
            ctx.fillRect(x - 5, y - 5, 10, 10)
            break
          case 2: // Cross
            ctx.beginPath()
            ctx.moveTo(x - 5, y)
            ctx.lineTo(x + 5, y)
            ctx.moveTo(x, y - 5)
            ctx.lineTo(x, y + 5)
            ctx.strokeStyle = "rgba(99, 102, 241, 0.5)"
            ctx.stroke()
            break
          case 3: // Connection line
            const direction = Math.floor(Math.random() * 4)
            ctx.beginPath()
            ctx.moveTo(x, y)

            if (direction === 0) ctx.lineTo(x + gridSize, y)
            else if (direction === 1) ctx.lineTo(x - gridSize, y)
            else if (direction === 2) ctx.lineTo(x, y + gridSize)
            else ctx.lineTo(x, y - gridSize)

            ctx.strokeStyle = "rgba(99, 102, 241, 0.5)"
            ctx.stroke()
            break
        }
      }
    }

    drawCircuit()
    window.addEventListener("resize", drawCircuit)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("resize", drawCircuit)
    }
  }, [])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
