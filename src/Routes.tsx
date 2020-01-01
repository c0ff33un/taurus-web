import React from 'react'
import { Login, SignUp, Game, Menu, NotFound, Profile } from 'Containers'
import Confirm from './Containers/Auth/Confirm'
import { Route, Switch } from 'react-router-dom'
import AuthenticatedRoute from './Components/AuthenticatedRoute'
import UnathenticatedRoute from './Components/UnathenticatedRoute'

export default function Routes() {
  return (
    <Switch>
      <UnathenticatedRoute exact path="/" component={Login} />
      <UnathenticatedRoute exact path="/signup" component={SignUp} />
      {/*
      <UnathenticatedRoute
        exact
        path="/confirm/:token"
        component={Confirm}
      />
      */}

      <AuthenticatedRoute exact path="/menu" component={Menu} />
      <AuthenticatedRoute exact path="/game" component={Game} />
      <AuthenticatedRoute exact path="/profile" component={Profile} />
      {/* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  )
}
