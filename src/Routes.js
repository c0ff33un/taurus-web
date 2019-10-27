import React from 'react';
import loginConnection from './Components/Auth/Login';
import registerConnection from './Components/Auth/SignUp';
import Game from './Components/Game/Game';
import { Route, Switch } from 'react-router-dom'
export default function Routes () {
  return (
    <Switch>
      <Route path="/game" component={Game}/>
      <Route path="/login" component={loginConnection}/>
      <Route path="/signup" component={registerConnection}/>
    </Switch>
  )
}
