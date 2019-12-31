const SET_EMAIL='SET_EMAIL'
const SET_HANDLE='SET_HANDLE'
const SET_PASSWORD='SET_PASSWORD'

type Registration = {
  email: string,
  handle: string,
  password: string
}
interface setEmailAction {
  type: typeof SET_EMAIL
  payload: string
}
interface setHandleAction {
  type: typeof SET_HANDLE
  payload: string
}
interface setPasswordAction {
  type: typeof SET_PASSWORD
  payload: string
}
type RegistrationActionTypes = setEmailAction | setHandleAction | setPasswordAction

export function setEmail(email: string): RegistrationActionTypes {
  return { type: SET_EMAIL, payload: email }
}

export function setHandle(handle: string): RegistrationActionTypes {
  return { type: SET_HANDLE, payload: handle }
}

export function setPassword(password: string): RegistrationActionTypes {
  return { type: SET_PASSWORD, payload: password }
}

const initialState= { email: '', handle: '', password: '' }
function registration(state=initialState, action: RegistrationActionTypes) {
    switch(action.type) {
      case SET_EMAIL:
        const email = action.payload
        return { ...state, email }
      case SET_HANDLE:
        const handle = action.payload
        return { ...state, handle }
      case SET_PASSWORD:
        const password = action.payload
        return { ...state, password }
      default:
        return state
    }
}

export default registration
