import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route {...rest} render={
      props => 
        localStorage.getItem('user')?
        <C {...props} {...appProps} />
        :
        <Redirect to='/'/>
    } />
  );
}
