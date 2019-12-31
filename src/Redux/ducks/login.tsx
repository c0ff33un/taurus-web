const SET_EMAIL='SET_LOGIN_EMAIL'
const SET_PASSWORD='SET_LOGIN_PASSWORD'
const CLEAN_CREDENTIALS='CLEAN_CREDENTIALS'

type Login = {
  email: string,
  password: string,
}
interface setEmailAction {
  type: typeof SET_EMAIL
  payload: string
}
interface setPasswordAction {
  type: typeof SET_PASSWORD
  payload: string
}
interface cleanCredentialsAction {
  type: typeof CLEAN_CREDENTIALS
}
type LoginActionTypes = setEmailAction | setPasswordAction | cleanCredentialsAction

export function setEmail(email: string): LoginActionTypes { return { type: SET_EMAIL, payload: email }}
export function setPassword(password: string): LoginActionTypes { return { type: SET_PASSWORD, payload: password }}
export function cleanCredentials(): LoginActionTypes { return { type: CLEAN_CREDENTIALS }}

const initialState = { email: '', password: '' }

function login(state=initialState, action: LoginActionTypes): Login {
  switch (action.type) {
    case SET_EMAIL:
      const email = action.payload
      return { ...state, email }
    case SET_PASSWORD:
      const password = action.payload
      return { ...state, password }
    case CLEAN_CREDENTIALS:
      return initialState
    default:
      return state
  }
}

export default login
