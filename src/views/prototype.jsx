import React, { useState } from 'react'
// Navigation is rendered globally in `index.js` to avoid duplicate navbars
import Footer from '../components/footer-new'
import './prototype.css'

const slides = [
  '/assets/placeholder-esp32.svg',
  '/assets/placeholder-ui.svg',
  '/assets/placeholder-diagram.svg',
]

const Prototype = () => {
  const [index, setIndex] = useState(0)

  function prev() { setIndex((i) => (i - 1 + slides.length) % slides.length) }
  function next() { setIndex((i) => (i + 1) % slides.length) }

  return (
    <div className="proto-page noisy-bg">
      <main className="proto-main">
        <section className="proto-hero animate-fade-in-down">
          <div className="proto-container">
            <h1 className="hero-title animate-slide-in-left">Prototype &amp; Demo</h1>
            <p className="proto-subtitle animate-slide-in-left delay-1">
              Explore the ClassNote AI system architecture, see live demos, and access the codebase.
            </p>
          </div>
        </section>

        <div className="proto-container">
          {/* Demo Section */}
          <section className="proto-demo-section animate-fade-in-up">
            <div className="demo-grid">
              {/* Left: Video */}
              <div className="demo-left surface-card-elevated hover-lift">
                <h2 className="animate-fade-in-up delay-2">Demo Video</h2>
                <div className="video-placeholder surface-card">
                  <div className="video-body">
                    <span className="material-icons" style={{ fontSize: '48px' }}>play_circle</span>
                  </div>
                </div>
                <div className="demo-actions">
                  <a href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI" target="_blank" rel="noreferrer" className="btn btn-outline btn-lg button-ripple">
                    <span className="material-icons">code</span>
                    View Code
                  </a>
                </div>
              </div>

              {/* Right: Carousel */}
              <div className="demo-right surface-card-elevated hover-lift">
                <div className="carousel-section">
                  <h2 className="animate-fade-in-up delay-3">Gallery</h2>
                  <div className="carousel surface-card">
                    <img src={slides[index]} alt={`slide-${index}`} className="carousel-image animate-fade-in" />
                    <div className="carousel-controls">
                      <button onClick={prev} aria-label="Previous" className="carousel-btn button-ripple">
                        <span className="material-icons">chevron_left</span>
                      </button>
                      <span className="carousel-indicator">{index + 1} / {slides.length}</span>
                      <button onClick={next} aria-label="Next" className="carousel-btn button-ripple">
                        <span className="material-icons">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* How It Works Section */}
          <section className="proto-specs-section animate-fade-in-up">
            <h2 className="animate-fade-in-up delay-4">How It Works</h2>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'stretch', maxWidth: '1200px', margin: '2rem auto' }}>
              <div style={{ flex: 1, background: 'var(--color-surface-container)', borderRadius: 'var(--border-radius-xl)', padding: '2rem', textAlign: 'center', position: 'relative', border: '1px solid var(--color-outline-variant)' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>1</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--font-size-title-lg)', color: 'var(--color-on-surface)' }}>ESP32 Audio Capture</h3>
                <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>Multi-speaker I2S microphone array captures classroom audio with precision.</p>
              </div>

              <div style={{ flex: 1, background: 'var(--color-surface-container)', borderRadius: 'var(--border-radius-xl)', padding: '2rem', textAlign: 'center', position: 'relative', border: '1px solid var(--color-outline-variant)' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>2</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--font-size-title-lg)', color: 'var(--color-on-surface)' }}>Whisper Transcription</h3>
                <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>On-device AI inference converts speech to text locally — privacy‑first.</p>
              </div>

              <div style={{ flex: 1, background: 'var(--color-surface-container)', borderRadius: 'var(--border-radius-xl)', padding: '2rem', textAlign: 'center', border: '1px solid var(--color-outline-variant)' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>3</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--font-size-title-lg)', color: 'var(--color-on-surface)' }}>Cloud Sync</h3>
                <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>Secure cloud storage and real‑time web access to transcripts.</p>
              </div>
            </div>
          </section>


          {/* CTA Section */}
          <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)', maxWidth: '700px', margin: '0 auto', background: 'var(--color-surface-container)', padding: 'var(--spacing-3xl)', borderRadius: '48px', border: '1px solid var(--color-outline-variant)', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: 'var(--font-size-headline-lg)', color: 'var(--color-on-surface)', fontFamily: 'var(--font-family-display)', fontWeight: 400 }}>Get Started</h2>
              <p style={{ margin: '0 0 var(--spacing-xl) 0', fontSize: 'var(--font-size-body-lg)', color: 'var(--color-on-surface-variant)' }}>
                Clone the repo, review the documentation, and deploy to your classroom.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <a href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg button-ripple">
                  <span className="material-icons">open_in_new</span>
                  GitHub Repository
                </a>
                <a href="/" className="btn btn-outline btn-lg button-ripple">
                  <span className="material-icons">arrow_back</span>
                  Back to Home
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Prototype
