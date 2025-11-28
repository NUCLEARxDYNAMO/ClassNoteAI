import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
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
import UploadProgress from './components/upload-progress'
import { UploadProvider } from './contexts/upload-context'

const App = () => {
  return (
    <UploadProvider>
      <Router>
        <Navigation />
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={Prototype} path="/prototype" />
          <Route component={Login} path="/login" />
          <Route component={Lectures} exact path="/lectures" />
          <Route component={LectureDetail} path="/lectures/:id" />
          {/* Catch-all route for unknown paths */}
          <Route component={NotFound} />
        </Switch>
        <UploadProgress />
      </Router>
    </UploadProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
