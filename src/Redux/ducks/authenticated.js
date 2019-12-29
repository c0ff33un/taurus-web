const SET_AUTHENTICATED='SET_AUTHENTICATED'
const SET_UNAUTHENTICATED='SET_UNAUTHENTICATED'

export function setAuthenticated() { return { type: SET_AUTHENTICATED } }
export function setUnAuthenticated() { return { type: SET_UNAUTHENTICATED } }

export default function authentication(state=false, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return true
    case SET_UNAUTHENTICATED:
      return false
    default:
      return state
  }
}
