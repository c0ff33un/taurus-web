const SET_AUTHENTICATED='SET_AUTHENTICATED'
const SET_UNAUTHENTICATED='SET_UNAUTHENTICATED'

type Authenticated = boolean
interface setAuthenticatedAction {
  type: typeof SET_AUTHENTICATED
}
interface setUnAuthenticatedAction {
  type: typeof SET_UNAUTHENTICATED
}
type AuthenticatedActionTypes = setAuthenticatedAction | setUnAuthenticatedAction

export function setAuthenticated(): AuthenticatedActionTypes { return { type: SET_AUTHENTICATED } }
export function setUnAuthenticated(): AuthenticatedActionTypes { return { type: SET_UNAUTHENTICATED } }


const initialState = false
export default function authentication(state=initialState, action: AuthenticatedActionTypes): Authenticated {
  switch (action.type) {
  case SET_AUTHENTICATED:
    return true
  case SET_UNAUTHENTICATED:
    return false
  default:
    return state
  }
}
