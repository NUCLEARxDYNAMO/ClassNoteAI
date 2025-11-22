import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import './styles/animations.css'
import Home from './views/home-new'
import Prototype from './views/prototype'
import Login from './views/login'
import Lectures from './views/lectures'
import LectureDetail from './views/lecture-detail'
import NotFound from './views/not-found'
import Navigation from './components/navigation'

// Simple private route wrapper
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuth = !!localStorage.getItem('cnai_auth')
  return (
    <Route
      {...rest}
      render={(props) => (isAuth ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  )
}

const App = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={Prototype} path="/prototype" />
        <Route component={Login} path="/login" />
        <PrivateRoute component={Lectures} exact path="/lectures" />
        <PrivateRoute component={LectureDetail} path="/lectures/:id" />
        {/* Catch-all route for unknown paths */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
