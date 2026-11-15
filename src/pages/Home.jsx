import { Link } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    boxSizing: 'border-box',
    fontFamily: 'system-ui, sans-serif',
    background: '#111827',
    color: '#f9fafb',
    textAlign: 'center',
  },
  title: { fontSize: 48, margin: 0, color: '#ff5a36' },
  text: { maxWidth: 420, margin: 0, color: '#d1d5db', lineHeight: 1.5 },
  button: {
    padding: '14px 32px',
    borderRadius: 999,
    background: '#ff5a36',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    textDecoration: 'none',
  },
  list: { maxWidth: 420, margin: 0, paddingLeft: 20, color: '#d1d5db', textAlign: 'left', lineHeight: 1.7 },
}

export default function Home() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Lane Dash</h1>
      <p style={styles.text}>Steer your car through traffic and dodge every barrier. How far can you get?</p>
      <Link to="/play" style={styles.button}>Play</Link>
      <h2 style={{ fontSize: 20, margin: '16px 0 0' }}>How to play</h2>
      <ul style={styles.list}>
        <li>Move left or right between three lanes.</li>
        <li>Hit a red barrier and the crash ends the run.</li>
        <li>The longer you survive, the faster the road moves.</li>
      </ul>
    </main>
  )
}
