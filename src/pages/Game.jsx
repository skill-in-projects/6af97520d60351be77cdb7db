import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const WIDTH = 300
const HEIGHT = 480
const LANES = 3
const LANE_WIDTH = WIDTH / LANES
const CAR_W = 40
const CAR_H = 70
const CAR_CY = HEIGHT - 24 - CAR_H / 2
const OBSTACLE = 40

const laneX = (lane) => lane * LANE_WIDTH + LANE_WIDTH / 2

function createGame(status = 'ready') {
  return { status, lane: 1, carX: laneX(1), obstacles: [], distance: 0, speed: 4, spawnTimer: 30, score: 0 }
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 16,
    boxSizing: 'border-box',
    fontFamily: 'system-ui, sans-serif',
    background: '#111827',
    color: '#f9fafb',
  },
  topBar: { width: WIDTH, maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: '#d1d5db' },
  canvas: { width: WIDTH, maxWidth: '100%', height: 'auto', borderRadius: 16, background: '#2b3240' },
  controls: { display: 'flex', gap: 10, width: WIDTH, maxWidth: '100%' },
  steerBtn: {
    flex: 1,
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    background: '#374151',
    color: '#f9fafb',
    fontSize: 16,
    cursor: 'pointer',
    touchAction: 'manipulation',
  },
  startBtn: {
    flex: 1.4,
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    background: '#ff5a36',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
  },
  hint: { margin: 0, color: '#9ca3af', fontSize: 14, textAlign: 'center' },
}

export default function Game() {
  const canvasRef = useRef(null)
  const gameRef = useRef(createGame())
  const [status, setStatus] = useState('ready')
  const [score, setScore] = useState(0)

  const steer = useCallback((dir) => {
    const g = gameRef.current
    if (g.status !== 'playing') return
    g.lane = Math.min(LANES - 1, Math.max(0, g.lane + dir))
  }, [])

  const start = useCallback(() => {
    gameRef.current = createGame('playing')
    setScore(0)
    setStatus('playing')
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    let frame

    const update = (g) => {
      g.distance += g.speed
      g.speed = Math.min(12, 4 + g.distance / 2500)
      g.score = Math.floor(g.distance / 10)
      g.carX += (laneX(g.lane) - g.carX) * 0.25

      g.spawnTimer -= 1
      if (g.spawnTimer <= 0) {
        g.obstacles.push({ lane: Math.floor(Math.random() * LANES), y: -OBSTACLE })
        g.spawnTimer = 30 + Math.random() * 30
      }
      g.obstacles.forEach((o) => {
        o.y += g.speed
      })
      g.obstacles = g.obstacles.filter((o) => o.y < HEIGHT + OBSTACLE)

      const hit = g.obstacles.some(
        (o) =>
          Math.abs(laneX(o.lane) - g.carX) < (OBSTACLE + CAR_W) / 2 - 8 &&
          Math.abs(o.y - CAR_CY) < (OBSTACLE + CAR_H) / 2 - 8,
      )
      if (hit) {
        g.status = 'over'
        setStatus('over')
      }
    }

    const draw = (g) => {
      ctx.fillStyle = '#2b3240'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      ctx.strokeStyle = '#f5c542'
      ctx.lineWidth = 4
      ctx.setLineDash([24, 24])
      ctx.lineDashOffset = -(g.distance % 48)
      for (let i = 1; i < LANES; i++) {
        ctx.beginPath()
        ctx.moveTo(i * LANE_WIDTH, 0)
        ctx.lineTo(i * LANE_WIDTH, HEIGHT)
        ctx.stroke()
      }
      ctx.setLineDash([])

      g.obstacles.forEach((o) => {
        const x = laneX(o.lane) - OBSTACLE / 2
        ctx.fillStyle = '#e4572e'
        ctx.beginPath()
        ctx.roundRect(x, o.y - OBSTACLE / 2, OBSTACLE, OBSTACLE, 8)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x + 6, o.y - 4, OBSTACLE - 12, 8)
      })

      const cx = g.carX - CAR_W / 2
      const cy = CAR_CY - CAR_H / 2
      ctx.fillStyle = '#2ec4b6'
      ctx.beginPath()
      ctx.roundRect(cx, cy, CAR_W, CAR_H, 10)
      ctx.fill()
      ctx.fillStyle = '#1b2a3a'
      ctx.fillRect(cx + 6, cy + 12, CAR_W - 12, 14)
      ctx.fillRect(cx + 6, cy + CAR_H - 26, CAR_W - 12, 12)

      if (g.status !== 'playing') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.font = 'bold 26px system-ui, sans-serif'
        ctx.fillText(g.status === 'over' ? 'Crash!' : 'Ready?', WIDTH / 2, HEIGHT / 2 - 10)
        ctx.font = '16px system-ui, sans-serif'
        ctx.fillText(g.status === 'over' ? `Score: ${g.score}` : 'Press Start', WIDTH / 2, HEIGHT / 2 + 20)
      }
    }

    const tick = () => {
      const g = gameRef.current
      if (g.status === 'playing') update(g)
      setScore(g.score)
      draw(g)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        steer(-1)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        steer(1)
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (gameRef.current.status !== 'playing') start()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [steer, start])

  const buttonLabel = status === 'playing' ? 'Restart' : status === 'over' ? 'Play again' : 'Start'

  return (
    <main style={styles.page}>
      <div style={styles.topBar}>
        <Link to="/" style={styles.link}>← Home</Link>
        <strong>Score: {score}</strong>
      </div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={styles.canvas} aria-label="Car game road" />
      <div style={styles.controls}>
        <button type="button" style={styles.steerBtn} onPointerDown={() => steer(-1)}>
          ◀ Left
        </button>
        <button type="button" style={styles.startBtn} onClick={start}>
          {buttonLabel}
        </button>
        <button type="button" style={styles.steerBtn} onPointerDown={() => steer(1)}>
          Right ▶
        </button>
      </div>
      <p style={styles.hint}>Use the arrow keys or A and D, or the buttons. Dodge the red barriers!</p>
    </main>
  )
}
