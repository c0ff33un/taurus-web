import { userHelper } from './helper'
import { finishLoading } from '../loading'

const LOGIN_REQUEST='USERS_LOGIN_REQUEST'
const LOGIN_GUEST='USERS_LOGIN_GUEST'
const LOGIN_SUCCESS='USERS_LOGIN_SUCCESS'
const LOGIN_FAILURE='USERS_LOGIN_FAILURE'
const LOGOUT='USERS_LOGOUT'

export const userActions = {
  login,
  guestLogin
}

function login(email, password) {
    return (dispatch) => {
        dispatch(request({ email }));
        return userHelper.login(email, password)
            .then(user => dispatch(success(user)))
            .catch(error => dispatch(failure(error)));
    };

    function request(user) { return { type: LOGIN_REQUEST, user } }
    function success(user) { return { type: LOGIN_SUCCESS, user } }
    function failure(error) { return { type: LOGIN_FAILURE, error } }
}

function guestLogin(){
    return (dispatch) => {
        dispatch(guest());
        return userHelper.guestLogin()
            .then(user => dispatch(success(user)))
            .catch(error => dispatch(failure(error)))
    };
    
    function guest() { return { type: LOGIN_REQUEST} }
    function success(user) { return { type: LOGIN_SUCCESS, user } }
    function failure(error) { return { type: LOGIN_FAILURE, error } }
}

export function logout(){
  return (dispatch, getState) =>{
    const { token } = getState().authentication.user
    return userHelper.logout(token)
      .then(() => {
        dispatch({ type: LOGOUT })
        dispatch(finishLoading())
      })
  }
}

function authentication(state={}, action) {
    switch (action.type) {
      case LOGIN_REQUEST:
        return {
          loggingIn: true,
          user: action.user
        };
      case LOGIN_SUCCESS:
        return {
          isAuthenticated: true,
          user: action.user
        };
      case LOGIN_FAILURE:
        return {};
      case LOGOUT:
        return {};
      case LOGIN_GUEST:
        return { loggingIn: true }
      default:
        return state
    }
}

export default authentication
