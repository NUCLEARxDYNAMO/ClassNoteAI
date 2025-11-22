// Minimal client-side auth helper (for demo purposes only)
const AUTH_KEY = 'cnai_auth'

export function login(username, password) {
  // hard-coded credentials for now
  if (username === 'test' && password === 'pass') {
    const payload = { user: username, ts: Date.now() }
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(AUTH_KEY)
}

export function getUser() {
  const v = localStorage.getItem(AUTH_KEY)
  if (!v) return null
  try {
    return JSON.parse(v).user
  } catch (e) {
    return null
  }
}

export default { login, logout, isAuthenticated, getUser }
