import { registerRequest } from './helper'

const REGISTER_REQUEST='USERS_REGISTER_REQUEST'
const REGISTER_SUCCESS='USERS_REGISTER_SUCCESS'
const REGISTER_FAILURE='USERS_REGISTER_FAILURE'

export function register(user) {
    return (dispatch) => {
        dispatch(request(user));
        return registerRequest(user)
            .then(user => dispatch(success(user)) )
            .catch(error => dispatch(failure(error)));
    };

    function request(user) { return { type: REGISTER_REQUEST, user } }
    function success(user) { return { type: REGISTER_SUCCESS, user } }
    function failure(error) { return { type: REGISTER_FAILURE, error } }
}

function registration(state={}, action) {
    switch(action.type) {
        case REGISTER_REQUEST:
            return { registering: true };
        case REGISTER_SUCCESS:
            return {};
        case REGISTER_FAILURE: 
            return {};
        default:
            return state
    }
}

export default registration
