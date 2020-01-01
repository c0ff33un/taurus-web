import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useTypedSelector } from 'Redux'

const AuthenticatedRoute = ({ component: C, ...rest }: RouteProps) => {
  const authenticated: boolean = useTypedSelector(state => state.authenticated)
  if (authenticated) {
    return <Route component={C} {...rest} />
  }
  return (
    <Route
      {...rest}
      render={props => (
        <Redirect
          to={`/?redirect=${props.location.pathname}${props.location.search}`}
        />
      )}
    />
  )
}

export default AuthenticatedRoute
