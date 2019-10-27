import React from 'react';
import App from './App'
import Login from './Components/Auth/Login';
import registerConnection from './Components/Auth/SignUp';
import Game from './Components/Game/Game';
import { Route, Switch } from 'react-router-dom'
export default function Routes () {
  return (
    <Switch>
      <Route path="/game" component={Game}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={registerConnection}/>
    </Switch>
  )
}
