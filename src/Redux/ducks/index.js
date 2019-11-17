import { combineReducers } from 'redux'
import { userConstants } from '../Actions'
import gameController from './gameController'
import messageLog from './messageLog'
import loading from './loading'
import websockets from './websockets'

function registration(state={}, action) {
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

function authentication(state=initialState, action) {
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
  authentication,
  gameController,
  messageLog,
  websockets
})
