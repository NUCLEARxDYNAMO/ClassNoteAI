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
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [stepsIndex, setStepsIndex] = useState(0)

  function prevGallery() { setGalleryIndex((i) => (i - 1 + slides.length) % slides.length) }
  function nextGallery() { setGalleryIndex((i) => (i + 1) % slides.length) }

  function prevStep() { setStepsIndex((i) => (i - 1 + 3) % 3) }
  function nextStep() { setStepsIndex((i) => (i + 1) % 3) }

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
                    <img src={slides[galleryIndex]} alt={`slide-${galleryIndex}`} className="carousel-image animate-fade-in" />
                    <div className="carousel-controls">
                      <button onClick={prevGallery} aria-label="Previous" className="carousel-btn button-ripple">
                        <span className="material-icons">chevron_left</span>
                      </button>
                      <span className="carousel-indicator">{galleryIndex + 1} / {slides.length}</span>
                      <button onClick={nextGallery} aria-label="Next" className="carousel-btn button-ripple">
                        <span className="material-icons">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* How It Works Section - Carousel */}
          <section className="proto-specs-section">
            <h2 className="animate-fade-in-up delay-4">How It Works</h2>

            <div className="steps-carousel">
              <div className="steps-carousel-container">
                <div className="steps-carousel-track" style={{ transform: `translateX(-${stepsIndex * 100}%)` }}>
                  {/* Step 1 */}
                  <div className={`step-card ${stepsIndex === 0 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <h3>ESP32 Audio Capture</h3>
                    <p>Multi-speaker I2S microphone array captures classroom audio with precision.</p>
                  </div>

                  {/* Step 2 */}
                  <div className={`step-card ${stepsIndex === 1 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <h3>Whisper Transcription</h3>
                    <p>On-device AI inference converts speech to text locally — privacy‑first.</p>
                  </div>

                  {/* Step 3 */}
                  <div className={`step-card ${stepsIndex === 2 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <h3>Cloud Sync</h3>
                    <p>Secure cloud storage and real‑time web access to transcripts.</p>
                  </div>
                </div>
              </div>

              <div className="steps-carousel-controls">
                <button onClick={prevStep} aria-label="Previous Step" className="carousel-btn button-ripple">
                  <span className="material-icons">chevron_left</span>
                </button>
                <span className="carousel-indicator">{stepsIndex + 1} / 3</span>
                <button onClick={nextStep} aria-label="Next Step" className="carousel-btn button-ripple">
                  <span className="material-icons">chevron_right</span>
                </button>
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
