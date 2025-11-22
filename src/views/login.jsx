import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './login.css'
import auth from '../auth'

const Login = () => {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const submit = (e) => {
    e.preventDefault()
    if (auth.login(user, pass)) {
      // notify other components that auth changed so nav updates
      window.dispatchEvent(new Event('cnai_auth_changed'))
      history.push('/lectures')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h2>Sign in</h2>
        <label>
          Username
          <input value={user} onChange={(e) => setUser(e.target.value)} autoFocus />
        </label>
        <label>
          Password
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>
        {error && <div className="login-error">{error}</div>}
        <div className="login-actions">
          <button type="submit" className="btn btn-primary">Sign in</button>
        </div>
        <div className="login-hint">Use <strong>test</strong> / <strong>pass</strong></div>
      </form>
    </div>
  )
}

export default Login
