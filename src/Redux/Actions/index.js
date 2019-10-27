import { userHelper } from '../Helpers'
import { fail } from 'assert';

export const userConstants = {
    REGISTER_REQUEST: 'USERS_REGISTER_REQUEST',
    REGISTER_SUCCESS: 'USERS_REGISTER_SUCCESS',
    REGISTER_FAILURE: 'USERS_REGISTER_FAILURE',

    LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
    LOGIN_GUEST: 'USERS_LOGIN_GUEST',
    LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
    LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',

    LOGOUT: 'USERS_LOGOUT'
};

export const userActions = {
   register,
   login,
   guestLogin,
   logout
}

function register(user) {
    return dispatch => {
        dispatch(request(user));
        userHelper.register(user)
            .then(user => dispatch(success(user)) )
            .catch(error => dispatch(failure(error)));
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}


function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));
        userHelper.login(email, password)
            .then(user => dispatch(success(user)) )
            .catch(error => dispatch(failure(error)));
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}


function guestLogin(){
    return dispatch => {
        dispatch(guest());
        userHelper.guestLogin()
            .then(user => dispatch(success(user)))
            .catch(error => dispatch(failure(error)))
    };
    
    function guest() { return { type: userConstants.LOGIN_REQUEST} }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userHelper.logout()
    return { type: userConstants.LOGOUT } 
}