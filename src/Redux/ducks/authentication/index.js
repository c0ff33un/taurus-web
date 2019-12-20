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

function loginRequest() { 
  return { type: LOGIN_REQUEST }
}

function loginSuccess(user, jwt) { 
  return { type: LOGIN_SUCCESS, payload: { user, jwt}}
}

function loginFailure(error) { 
  return { type: LOGIN_FAILURE, error }
}

function loginRequestOptions(data){
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
}

const apiUrl = process.env.REACT_APP_API_URL

export function login(email, password) {
  const data = {
    "query": `mutation {login(user:{email:"${email}" password:"${password}"}) {user{id handle email guest} jwt} }`
  }
  return dispatch => {
    dispatch(loginRequest({ email }));
    return fetch(apiUrl, loginRequestOptions(data))
      .then(res => res.json())
      .then(res => {
        if (!res.data) {
          throw new Error(res.errors[0].message)
        }
        const { user, jwt } = res.data.login
        dispatch(loginSuccess(user, jwt))
        return res
      })
      .catch(err => {
        alert(`Sorry, that didn't work`)
        //dispatch(errorAlert(`Sorry, that didn't work`))
        dispatch(loginFailure(err))
        return err
      })
      .finally(() => dispatch(finishLoading()))
  };
}

export function guestLogin(){
  const data = {
    "query": "mutation {guest{user{id handle email guest} jwt}}"
  }
  return dispatch => {
    return fetch(apiUrl, loginRequestOptions(data))
      .then(res => res.json())
      .then(res => {
        if (!res.data) {
          throw new Error(res.erors[0].message)
        }
        const { user, jwt } = res.data.guest
        dispatch(loginSuccess(user, jwt))
        return res
      })
      .catch(err => {
        alert(`Sorry, that didn't work`)
        //dispatch(errorAlert(`Sorry, that didn't work`))
        dispatch(loginFailure(err))
        return err
      })
      .finally(() => dispatch(finishLoading()))
  }
}

export function logout(){
  return (dispatch, getState) =>{
    const { token } = getState().authentication.user
    const mutation = {
      "query": `mutation {logout{msg}}`
    }
    var options = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(mutation),
    }
    return fetch(apiUrl, options)
      .then(res => res.json())
      .then(res => {
        dispatch({ type: LOGOUT })
      })
      .catch(err => {
        alert(`Sorry, that didn't work`)
      })
      .finally(() => { dispatch(finishLoading()); })
  }
}

function authentication(state={}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { loggingIn: true }
    case LOGIN_SUCCESS:
      const { user, jwt } = action.payload
      return { isAuthenticated: true, user, jwt }
    case LOGIN_FAILURE:
      return { loggingIn: false };
    case LOGOUT:
      return {};
    case LOGIN_GUEST:
      return { loggingIn: true }
    default:
      return state
  }
}

export default authentication
