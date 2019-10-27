import React from 'react';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import Game from './Components/Game/Game';
import { Route, Switch } from 'react-router-dom'
export default function Routes () {
  return (
    <Switch>
      <Route exact path="/game" component={Game}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/signup" component={SignUp}/>
    </Switch>
    
  )
}
