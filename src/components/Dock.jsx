import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BOOKING_URL } from '../data/site'
import CalendarIcon from './CalendarIcon'

export default function Dock() {
  const [showTop, setShowTop] = useState(false)
  const [pad, setPad] = useState(0)
  const [rightPad, setRightPad] = useState(0)

  useEffect(() => {
    const sync = () => {
      setShowTop(window.scrollY > 420)
      const vv = window.visualViewport
      if (!vv) {
        setPad(0)
        setRightPad(0)
        return
      }
      // Lift above browser chrome / keyboard, and nudge left if layout width
      // is wider than the visible viewport (fixed `right` uses layout width).
      setPad(Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop))))
      setRightPad(Math.max(0, Math.round(window.innerWidth - (vv.width + vv.offsetLeft))))
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('scroll', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('scroll', sync)
    }
  }, [])

  return (
    <motion.div
      className="sticky-dock"
      aria-label="Quick contact"
      style={{
        '--dock-vv-pad': `${pad}px`,
        '--dock-vv-right': `${rightPad}px`,
      }}
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 280, damping: 18 }}
    >
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="back-to-top is-visible dock-float"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'grid', '--float-delay': '0.9s', order: 0 }}
          >
            <span aria-hidden="true">↑</span>
            <span className="back-to-top-label">Back to top</span>
          </motion.button>
        )}
      </AnimatePresence>
      <motion.div
        className="dock-float"
        style={{ '--float-delay': '0.45s', order: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <a
          className="dock-btn book"
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book a free call"
        >
          <CalendarIcon />
          <span>Book a call</span>
        </a>
      </motion.div>
      <motion.div
        className="dock-float"
        style={{ order: 2 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <Link className="dock-btn quote" to="/contact" aria-label="Contact us">
          Contact
        </Link>
      </motion.div>
    </motion.div>
  )
}
