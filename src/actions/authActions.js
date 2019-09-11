import { ERROR } from './index';

export const SIGNIN= "SIGNIN";
export const SIGNOUT = "SIGNOUT";
export const STOREUSERSESSION = "STOREUSERSESSION";

//export auth methods below
export function handleSignIn(e, userSession) {
    e.preventDefault();
    userSession.redirectToSignIn();
    return {
        type: SIGNIN
    }
}

export function handleSignOut(e, userSession) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
    return {
        type: SIGNOUT
    }
}

export function storeUserSession(userSession) {
    return {
        type: STOREUSERSESSION,
        payload: userSession
    }
}
