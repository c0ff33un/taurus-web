import React from 'react'
import { Route, RouteComponentProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

function querystring(name: string, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function UnauthenticatedRoute(props: RouteComponentProps) {
  const redirect = querystring("redirect")
  const authenticated: boolean = useSelector((state: any) => state.authenticated)
  return (
    !authenticated
    ? <Route {...props} />
    : <Redirect 
        to={redirect === "" || redirect === null ? "/menu" : redirect}
      />
  );
}

export default UnauthenticatedRoute
