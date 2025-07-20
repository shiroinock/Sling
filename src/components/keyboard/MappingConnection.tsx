import { useEffect, useRef } from 'react'

interface MappingConnectionProps {
  fromPosition: { x: number; y: number }
  toPosition: { x: number; y: number }
}

export function MappingConnection({
  fromPosition,
  toPosition
}: MappingConnectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set line style
    ctx.strokeStyle = '#10b981' // green-500
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    // Draw curved line
    ctx.beginPath()
    ctx.moveTo(fromPosition.x, fromPosition.y)
    
    const controlX1 = fromPosition.x + (toPosition.x - fromPosition.x) * 0.3
    const controlY1 = fromPosition.y - 50
    const controlX2 = toPosition.x - (toPosition.x - fromPosition.x) * 0.3
    const controlY2 = toPosition.y - 50
    
    ctx.bezierCurveTo(
      controlX1, controlY1,
      controlX2, controlY2,
      toPosition.x, toPosition.y
    )
    ctx.stroke()

    // Draw arrow
    const angle = Math.atan2(toPosition.y - controlY2, toPosition.x - controlX2)
    const arrowLength = 10
    
    ctx.beginPath()
    ctx.moveTo(toPosition.x, toPosition.y)
    ctx.lineTo(
      toPosition.x - arrowLength * Math.cos(angle - Math.PI / 6),
      toPosition.y - arrowLength * Math.sin(angle - Math.PI / 6)
    )
    ctx.moveTo(toPosition.x, toPosition.y)
    ctx.lineTo(
      toPosition.x - arrowLength * Math.cos(angle + Math.PI / 6),
      toPosition.y - arrowLength * Math.sin(angle + Math.PI / 6)
    )
    ctx.stroke()

  }, [fromPosition, toPosition])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  )
}