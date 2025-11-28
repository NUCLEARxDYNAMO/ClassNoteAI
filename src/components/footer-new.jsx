import React from 'react'
import './footer-new.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ClassNote AI</h3>
          <p>
            Captures lectures effortlessly. Focus on learning, not writing.
            Built by students at VNR VJIET.
          </p>
          <div className="footer-socials">
            <a href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI" target="_blank" rel="noreferrer" aria-label="GitHub">
              <span className="material-icons">code</span>
            </a>
            <a href="mailto:contact@classnoteai.edu" aria-label="Email">
              <span className="material-icons">email</span>
            </a>
            <a href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI#readme" target="_blank" rel="noreferrer" aria-label="Documentation">
              <span className="material-icons">description</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/prototype">Prototype</a></li>
            <li><a href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:contact@classnoteai.edu">contact@classnoteai.edu</a></li>
            <li>VNR VJIET, Hyderabad, India</li>
          </ul>
        </div>


      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ClassNote AI. All rights reserved. A student innovation project by VNR VJIET.</p>
      </div>
    </footer>
  )
}

export default Footer
