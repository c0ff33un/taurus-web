import React from 'react';
import Login from './Containers/Auth/Login';
import SignUp from './Containers/Auth/SignUp';
import Lobby from './Containers/Lobby';
import Game from './Containers/Game/Game';
import { Route, Switch } from 'react-router-dom'
export default function Routes () {
  return (
    <Switch>
      <Route exact path="/lobby" component={Lobby}/>
      <Route exact path="/game" component={Game}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/signup" component={SignUp}/>
    </Switch>
  )
}
