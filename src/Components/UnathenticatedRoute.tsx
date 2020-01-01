import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useTypedSelector } from 'Redux'

function querystring(name: string, url = window.location.href) {
  name = name.replace(/[[]]/g, '\\$&')

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i')
  const results = regex.exec(url)

  if (!results) {
    return null
  }
  if (!results[2]) {
    return ''
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function UnauthenticatedRoute({ component: C, ...rest }: RouteProps) {
  const redirect = querystring('redirect')
  const authenticated: boolean = useTypedSelector(state => state.authenticated)
  if (!authenticated) {
    return <Route component={C} {...rest} />
  }
  return (
    <Route
      {...rest}
      render={props => (
        <Redirect
          to={redirect === '' || redirect === null ? '/menu' : redirect}
        />
      )}
    />
  )
}

export default UnauthenticatedRoute
