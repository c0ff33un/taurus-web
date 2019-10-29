import React from 'react';
import Login from './Containers/Auth/Login';
import SignUp from './Containers/Auth/SignUp';
import Lobby from './Containers/Lobby';
import Game from './Containers/Game/Game';
import Menu from './Containers/Menu/Menu'
import { Route, Switch } from 'react-router-dom'
import AppliedRoute from './Components/AppliedRoute';
import ProtectedRoute from './Components/ProtectedRoute'
import NotFound from './Containers/NotFound'

export default function Routes ({ appProps }) {
  return (
    <Switch>
      <ProtectedRoute exact path="/lobby" component={Lobby} appProps={appProps}/>
      <ProtectedRoute exact path="/game" component={Game} appProps={appProps}/>
      <AppliedRoute exact path="/" component={Login} appProps={appProps}/>
      <AppliedRoute exact path="/signup" component={SignUp} appProps={appProps}/>
      <ProtectedRoute exact path="/menu" component={Menu} appProps={appProps}/>
      { /* Finally, catch all unmatched routes */}
      <Route component component={NotFound}/>
    </Switch>
  )
}
