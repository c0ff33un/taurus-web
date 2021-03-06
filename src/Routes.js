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

export default function Routes({ appProps }) {
  return (
    <Switch>
      <UnathenticatedRoute
        exact
        path="/"
        component={Login}
        appProps={appProps}
      />
      <UnathenticatedRoute
        exact
        path="/signup"
        component={SignUp}
        appProps={appProps}
      />
      <UnathenticatedRoute
        exact
        path="/confirm/:token"
        component={Confirm}
        appProps={appProps}
      />

      <AuthenticatedRoute
        exact
        path="/menu"
        component={Menu}
        appProps={appProps}
      />
      <AuthenticatedRoute
        exact
        path="/game"
        component={Game}
        appProps={appProps}
      />
      {/* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  )
}
