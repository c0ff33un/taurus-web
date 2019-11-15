import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        rest.isAuthenticated
          ? <C {...props} {...appProps} />
          : <Redirect
              to={`/?redirect=${props.location.pathname}${props.location
                .search}`}
            />}
    />
  );
}


function mapStateToProps(state) {
  const { authentication } = state
  console.log(authentication)
  return { isAuthenticated: authentication.isAuthenticated }
}

export default connect(mapStateToProps)(AuthenticatedRoute)
