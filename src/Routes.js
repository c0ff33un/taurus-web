import React from 'react';
import Login from './Containers/Auth/Login';
import SignUp from './Containers/Auth/SignUp';
import Lobby from './Containers/Lobby';
import Game from './Containers/Game/Game';
import Menu from './Containers/Menu/Menu'
import { Route, Switch } from 'react-router-dom'
import AppliedRoute from './Components/AppliedRoute';
import NotFound from './Containers/NotFound'

export default function Routes ({ appProps }) {
  return (
    <Switch>
      <AppliedRoute exact path="/lobby" component={Lobby} appProps={appProps}/>
      <AppliedRoute exact path="/game" component={Game} appProps={appProps}/>
      <AppliedRoute exact path="/login" component={Login} appProps={appProps}/>
      <AppliedRoute exact path="/signup" component={SignUp} appProps={appProps}/>
      <AppliedRoute exact path="/menu" component={Menu}/>
      { /* Finally, catch all unmatched routes */}
      <Route component component={NotFound}/>
    </Switch>
  )
}
