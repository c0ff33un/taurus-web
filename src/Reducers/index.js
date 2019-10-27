import {combineReducers} from 'redux'
import {userConstants} from '../Actions'

export default combineReducers({
  registration
})

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