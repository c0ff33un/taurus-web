import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

function querystring(name, url = window.location.href) {
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

function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
  const redirect = querystring("redirect")
  console.log(redirect)
  console.log(rest)
  return (
    <Route
      {...rest}
      render={props =>
        !rest.isAuthenticated
          ? <C {...props} {...appProps} />
          : <Redirect 
              to={redirect === "" || redirect === null ? "/menu" : redirect}
            />}
    />
  );
}

function mapStateToProps(state) {
  const { authentication } = state
  console.log('here')
  console.log(authentication)
  return { isAuthenticated: authentication.isAuthenticated }
}

export default connect(mapStateToProps)(UnauthenticatedRoute)