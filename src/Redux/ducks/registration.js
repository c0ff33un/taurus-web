const SET_EMAIL='SET_EMAIL'
const SET_HANDLE='SET_HANDLE'
const SET_PASSWORD='SET_PASSWORD'

export function setEmail(email) {
  return { type: SET_EMAIL, payload: { email } }
}

export function setHandle(handle) {
  return { type: SET_HANDLE, payload: { handle } }
}

export function setPassword(password) {
  return { type: SET_PASSWORD, payload: { password } }
}

function registration(state={}, action) {
    switch(action.type) {
      case SET_EMAIL:
        const { email } = action.payload
        return { ...state, email }
      case SET_HANDLE:
        const { handle } = action.payload
        return { ...state, handle }
      case SET_PASSWORD:
        const { password } = action.payload
        return { ...state, password }
      default:
        return state
    }
}

export default registration
