import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Footer from '../components/footer-new'
import './home-new.css'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true)

    // Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.scroll-reveal')

    const revealOnScroll = () => {
      revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top
        const windowHeight = window.innerHeight

        if (elementTop < windowHeight * 0.85) {
          el.classList.add('revealed')
        }
      })
    }

    window.addEventListener('scroll', revealOnScroll)
    // Initial check after a small delay to ensure DOM is ready
    setTimeout(revealOnScroll, 100)

    return () => {
      window.removeEventListener('scroll', revealOnScroll)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>ClassNote AI - Focus on Learning, Not Writing</title>
        <meta property="og.title" content="ClassNote AI" />
      </Helmet>

      <main className="home-main noisy-bg">
        <section className={`hero-section ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge animate-scale-in stagger-1">
                <span className="material-icons">auto_awesome</span>
                <span>AI-Powered Classroom Assistant</span>
              </div>
              <h1 className="hero-title animate-fade-in-up stagger-2">
                Focus on Learning, Not Writing
              </h1>
              <p className="hero-tagline animate-fade-in-up stagger-3">
                Captures lectures effortlessly. Never miss a key point again.
              </p>
              <div className="hero-ctas animate-fade-in-up stagger-4">
                <a href="/prototype" className="btn btn-outline btn-lg button-ripple animate-pulse">
                  <span className="material-icons">play_arrow</span>
                  Try the Prototype
                </a>
                <a
                  href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-lg button-ripple"
                >
                  <span className="material-icons">code</span>
                  View GitHub
                </a>
              </div>
            </div>
            <div className="hero-visual animate-float">
              <div className="hero-graphic">
                <span className="material-icons" style={{ fontSize: '120px' }}>mic</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title scroll-reveal">Key Features</h2>
            <p className="section-subtitle scroll-reveal">
              Everything you need to capture and organize classroom notes
            </p>
            <div className="features-grid">
              <div className="feature-card hover-lift scroll-reveal stagger-1">
                <div className="feature-icon">
                  <span className="material-icons">mic</span>
                </div>
                <h3>Smart Capture</h3>
                <p>High-quality audio capture made simple.</p>
              </div>
              <div className="feature-card hover-lift scroll-reveal stagger-2">
                <div className="feature-icon">
                  <span className="material-icons">psychology</span>
                </div>
                <h3>Smart Transcription</h3>
                <p>Automated transcription and concise summaries to save you time.</p>
              </div>
              <div className="feature-card hover-lift scroll-reveal stagger-3">
                <div className="feature-icon">
                  <span className="material-icons">cloud_upload</span>
                </div>
                <h3>Instant Sync</h3>
                <p>Sync notes and recordings across your devices.</p>
              </div>
              <div className="feature-card hover-lift scroll-reveal stagger-4">
                <div className="feature-icon">
                  <span className="material-icons">description</span>
                </div>
                <h3>Structured Notes</h3>
                <p>Organized transcripts with timestamps and highlights.</p>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </>
  )
}

export default Home
