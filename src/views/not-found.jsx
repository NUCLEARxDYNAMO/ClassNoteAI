import React from 'react'
import { Helmet } from 'react-helmet'
// Navigation is rendered globally in `index.js` to avoid duplicate navbars
import Footer from '../components/footer-new'
import './not-found.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <main className="not-found-main">
        <div className="not-found-content">
          <div className="not-found-icon">
            <span className="material-icons">error_outline</span>
          </div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-heading">Page Not Found</h2>
          <p className="not-found-text">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <div className="not-found-ctas">
            <a href="/" className="btn btn-primary btn-lg">
              <span className="material-icons">home</span>
              Back to Home
            </a>
            <a href="/prototype" className="btn btn-outline btn-lg">
              <span className="material-icons">play_arrow</span>
              View Prototype
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
