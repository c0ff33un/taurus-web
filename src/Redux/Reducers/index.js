import {combineReducers} from 'redux'
import {userConstants} from '../Actions'

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

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

function authentication(state = initialState, action) {
    switch (action.type) {
      case userConstants.LOGIN_REQUEST:
        return {
          loggingIn: true,
          user: action.user
        };
      case userConstants.LOGIN_SUCCESS:
        return {
          loggedIn: true,
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
  registration,
  authentication
})