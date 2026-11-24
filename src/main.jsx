import { StrictMode, startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { moduleForPath } from './routes.jsx'

const rawBase = import.meta.env.BASE_URL || '/'
const basename = rawBase.replace(/\/$/, '') || undefined

// GitHub Pages often serves the project root without a trailing slash.
// React Router then fails to match path="/". Normalize before mount.
if (basename && window.location.pathname === basename) {
  window.history.replaceState(null, '', `${basename}/`)
}

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Prerendered reveal targets that are already on screen stay visible through
// hydration; the rest go back to hidden (below the fold) and reveal on scroll.
function markKeepVisible() {
  const kept = []
  container
    .querySelectorAll('[style*="opacity:0"]:not([aria-hidden="true"]):not([aria-hidden="true"] *)')
    .forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.setAttribute('data-keep-visible', '')
        kept.push(el)
      }
    })
  return kept
}

function releaseKeepVisible(kept) {
  let tries = 0
  const release = () => {
    tries += 1
    for (let i = kept.length - 1; i >= 0; i--) {
      const el = kept[i]
      if (el.style.opacity === '1') {
        el.removeAttribute('data-keep-visible')
        kept.splice(i, 1)
      }
    }
    if (kept.length && tries <= 10) setTimeout(release, 1000)
  }
  setTimeout(release, 1500)
}

// Delay app-hydrated until after first paint so SSR text/header stay visible for
// FCP. Entrance CSS only runs under html.app-hydrated.
function markAppHydrated(kept) {
  const go = () => {
    document.documentElement.classList.add('app-hydrated')
    releaseKeepVisible(kept)
  }
  const afterPaint = () => requestAnimationFrame(() => requestAnimationFrame(go))
  if (document.visibilityState === 'hidden') {
    const onVisible = () => {
      document.removeEventListener('visibilitychange', onVisible)
      afterPaint()
    }
    document.addEventListener('visibilitychange', onVisible)
    // Safety: never leave the SSR opacity override forever.
    setTimeout(go, 4000)
  } else {
    afterPaint()
  }
}

const container = document.getElementById('root')
if (container.hasChildNodes()) {
  const path = basename ? window.location.pathname.slice(basename.length) : window.location.pathname
  Promise.resolve(moduleForPath(path)?.load()).then(() => {
    const kept = markKeepVisible()
    // Transition lane keeps hydration time-sliced so it never blocks the main thread.
    startTransition(() => {
      hydrateRoot(container, app)
      markAppHydrated(kept)
    })
  })
} else {
  createRoot(container).render(app)
  markAppHydrated([])
}
