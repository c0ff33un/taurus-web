import { combineReducers } from 'redux'
import { userConstants, START_LOADING, FINISH_LOADING } from '../Actions'

function registration( state = {}, action ) {
    switch(action.type) {
        case userConstants.REGISTER_REQUEST:
            return { registering: true };
        case userConstants.REGISTER_SUCCESS:
            return {};
        case userConstants.REGISTER_FAILURE: 
            return {};
        default:
            return state
    }
}

const initialState = {}

function loading(state=false, action) {
  switch (action.type) {
    case START_LOADING:
      return true
    case FINISH_LOADING:
      return false
    default:
      return state
  }
}

function authentication(state = initialState, action) {
    switch (action.type) {
      case userConstants.LOGIN_REQUEST:
        return {
          loggingIn: true,
          user: action.user
        };
      case userConstants.LOGIN_SUCCESS:
        return {
          isAuthenticated: true,
          user: action.user
        };
      case userConstants.LOGIN_FAILURE:
        return {};
      case userConstants.LOGOUT:
        return {};
      case userConstants.LOGIN_GUEST:
        return {
          loggingIn: true
        }
      default:
        return state
    }
}

export default combineReducers({
  loading,
  registration,
  authentication
})
