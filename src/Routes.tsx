import React from 'react'
import Login from './Containers/Auth/Login'
import SignUp from './Containers/Auth/SignUp'
import Confirm from './Containers/Auth/Confirm'
import Game from './Containers/Game'
import Menu from './Containers/Menu'
import { Route, Switch } from 'react-router-dom'
import AuthenticatedRoute from './Components/AuthenticatedRoute'
import UnathenticatedRoute from './Components/UnathenticatedRoute'
import NotFound from './Containers/NotFound'

export default function Routes() {
  return (
    <Switch>
      <UnathenticatedRoute
        exact
        path="/"
        component={Login}
      />
      <UnathenticatedRoute
        exact
        path="/signup"
        component={SignUp}
      />
      <UnathenticatedRoute
        exact
        path="/confirm/:token"
        component={Confirm}
      />

      <AuthenticatedRoute
        exact
        path="/menu"
        component={Menu}
      />
      <AuthenticatedRoute
        exact
        path="/game"
        component={Game}
      />
      {/* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  )
}
