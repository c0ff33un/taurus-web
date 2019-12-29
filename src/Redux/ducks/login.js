const SET_EMAIL='SET_LOGIN_EMAIL'
const SET_PASSWORD='SET_LOGIN_PASSWORD'
const CLEAN_CREDENTIALS='CLEAN_CREDENTIALS'

export function setEmail(email) { return { type: SET_EMAIL, payload: { email } }}
export function setPassword(password) { return { type: SET_PASSWORD, payload: { password } }}
export function cleanCredentials() { return { type: CLEAN_CREDENTIALS }}

const defaultState = { email: '', password: '' }

function authentication(state=defaultState, action) {
  switch (action.type) {
    case SET_EMAIL:
      const { email } = action.payload
      return { ...state, email }
    case SET_PASSWORD:
      const { password } = action.payload
      return { ...state, password }
    case CLEAN_CREDENTIALS:
      return defaultState
    default:
      return state
  }
}

export default authentication
