import React from 'react'
import { Route, RouteComponentProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthenticatedRoute = (props: RouteComponentProps) => {
  const authenticated: boolean = useSelector((state: any) => state.authenticated)
  return (
    authenticated
    ? <Route {...props}/>
    : <Redirect to={`/?redirect=${props.location.pathname}${props.location.search}`} />
  );
}

export default AuthenticatedRoute
