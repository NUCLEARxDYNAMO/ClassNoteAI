import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import Script from 'dangerous-html/react'

import './navigation.css'

// Small auth controls that show Login/Logout based on localStorage flag
const AuthControls = () => {
  const [auth, setAuth] = React.useState(false)

  React.useEffect(() => {
    // Check auth state on mount
    const checkAuth = () => setAuth(!!localStorage.getItem('cnai_auth'))
    checkAuth()

    // Listen for storage events and custom auth events
    window.addEventListener('storage', checkAuth)
    window.addEventListener('cnai_auth_changed', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('cnai_auth_changed', checkAuth)
    }
  }, [])

  const handle = () => {
    if (auth) {
      localStorage.removeItem('cnai_auth')
      // Dispatch custom event for immediate UI update
      window.dispatchEvent(new Event('cnai_auth_changed'))
      // force reload to update UI
      window.location.href = '/'
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <div className="nav-auth">
      <button className="btn" onClick={handle}>{auth ? 'Logout' : 'Login'}</button>
    </div>
  )
}

const Navigation = (props) => {
  const [auth, setAuth] = useState(!!localStorage.getItem('cnai_auth'))

  useEffect(() => {
    const onStorage = () => setAuth(!!localStorage.getItem('cnai_auth'))
    window.addEventListener('storage', onStorage)
    window.addEventListener('cnai_auth_changed', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cnai_auth_changed', onStorage)
    }
  }, [])
  return (
    <div className="navigation-container1">
      <nav
        id="mainNavigation"
        role="navigation"
        aria-label="Main Navigation"
        className="navigation"
      >
        <div className="navigation__container">
          <a href="/">
            <div aria-label="ClassNote AI Home" className="navigation__logo">
              <div className="navigation__logo-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M12 18V5m3 8a4.17 4.17 0 0 1-3-4a4.17 4.17 0 0 1-3 4m8.598-6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
                    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path>
                    <path d="M18 18a4 4 0 0 0 2-7.464"></path>
                    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path>
                    <path d="M6 18a4 4 0 0 1-2-7.464"></path>
                    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
                  </g>
                </svg>
              </div>
              <span className="navigation__logo-text">ClassNote AI</span>
            </div>
          </a>
          <button
            id="navToggle"
            aria-label="Toggle Navigation Menu"
            aria-expanded="false"
            aria-controls="navMenu"
            className="navigation__toggle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="navigation__toggle-open"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 5h16M4 12h16M4 19h16"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="navigation__toggle-close"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 6L6 18M6 6l12 12"
              ></path>
            </svg>
          </button>
          <div id="navMenu" className="navigation__menu">
            <ul className="navigation__list">
              <li className="navigation__item">
                <NavLink exact to="/" className="navigation__link" activeClassName="navigation__link--active">
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="navigation__item">
                <NavLink to="/prototype" className="navigation__link" activeClassName="navigation__link--active">
                  <span>Prototype</span>
                </NavLink>
              </li>
              {auth && (
                <li className="navigation__item">
                  <NavLink to="/lectures" className="navigation__link" activeClassName="navigation__link--active">
                    <span>Lectures</span>
                  </NavLink>
                </li>
              )}
            </ul>
            <div className="navigation__actions">
              {/** GitHub CTA stays */}
              <a href="https://github.com/NUCLEARxDYNAMO/ClassNoteAI" target="_blank" rel="noreferrer">
                <div className="navigation__cta-primary btn btn-primary">
                  <span>GitHub</span>
                </div>
              </a>
              {/** Login / Logout */}
              <AuthControls />
            </div>
          </div>
        </div>
        <div id="navProgress" className="navigation__progress"></div>
      </nav>
      <div className="navigation-container2">
        <div className="navigation-container3">
          <Script
            html={`<style>
@media (prefers-reduced-motion: reduce) {
.navigation, .navigation__logo, .navigation__logo-icon, .navigation__toggle svg, .navigation__link::before, .navigation__menu, .navigation__progress {
  transition: none;
}
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="navigation-container4">
        <div className="navigation-container5">
          <Script
            html={`<script defer data-name="navigation">
(function(){
  const nav = document.getElementById("mainNavigation")
  const navToggle = document.getElementById("navToggle")
  const navMenu = document.getElementById("navMenu")
  const navProgress = document.getElementById("navProgress")
  const navLinks = document.querySelectorAll(".navigation__link")

  let lastScrollY = window.scrollY
  let ticking = false

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("navigation__menu--open")

    if (isOpen) {
      navMenu.classList.remove("navigation__menu--open")
      navToggle.classList.remove("navigation__toggle--active")
      navToggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    } else {
      navMenu.classList.add("navigation__menu--open")
      navToggle.classList.add("navigation__toggle--active")
      navToggle.setAttribute("aria-expanded", "true")
      document.body.style.overflow = "hidden"
    }
  })

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 991) {
        navMenu.classList.remove("navigation__menu--open")
        navToggle.classList.remove("navigation__toggle--active")
        navToggle.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }

      navLinks.forEach((l) => l.classList.remove("navigation__link--active"))
      link.classList.add("navigation__link--active")
    })
  })

  function updateScrollProgress() {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100

    navProgress.style.width = scrollPercent + "%"
  }

  function handleScroll() {
    const currentScrollY = window.scrollY

    if (currentScrollY > 50) {
      nav.classList.add("navigation--scrolled")
    } else {
      nav.classList.remove("navigation--scrolled")
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      nav.classList.add("navigation--hidden")
    } else {
      nav.classList.remove("navigation--hidden")
    }

    lastScrollY = currentScrollY
    updateScrollProgress()
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
      navMenu.classList.remove("navigation__menu--open")
      navToggle.classList.remove("navigation__toggle--active")
      navToggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  })

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 991) {
      const isClickInsideNav = nav.contains(e.target)
      const isMenuOpen = navMenu.classList.contains("navigation__menu--open")

      if (!isClickInsideNav && isMenuOpen) {
        navMenu.classList.remove("navigation__menu--open")
        navToggle.classList.remove("navigation__toggle--active")
        navToggle.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }
    }
  })

  updateScrollProgress()
})()
</script>`}
          ></Script>
        </div>
      </div>
    </div>
  )
}

export default Navigation
