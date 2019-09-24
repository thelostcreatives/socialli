import  { AnyListUser } from '../models';

import { ERROR } from './index';

export const SIGNIN= "SIGNIN";
export const SIGNOUT = "SIGNOUT";
export const STOREUSERSESSION = "STOREUSERSESSION";

export const GETTING_CUSTOM_USER = "GETTING_CUSTOM_USER";
export const CUSTOM_USER_FOUND = "CUSTOM_USER_FOUND";

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

export const getCustomUser = ({profile, username}) => async (dispatch) => {
    dispatch({
        type: GETTING_CUSTOM_USER
    });

    const exists = await AnyListUser.fetchList({
        username
    });

    let user;

    if (exists.length > 0) {
        user = exists[0];
    } else {
        const newuser = new AnyListUser({
            name: profile.name,
            username,
            description: profile.description
        });

        const res = await newuser.save();
        user = res;
    }

    dispatch({
        type: CUSTOM_USER_FOUND,
        payload: user
    });
}
