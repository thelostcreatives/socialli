import  { AnyListUser } from '../models';

import { ERROR } from './index';

export const SIGNIN= "SIGNIN";
export const SIGNOUT = "SIGNOUT";
export const STOREUSERSESSION = "STOREUSERSESSION";

export const CREATING_CUSTOM_USER = "CREATING_CUSTOM_USER";
export const CUSTOM_USER_CREATED = "CUSTOM_USER_CREATED";

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

export const createCustomUser = ({profile, username}) => async (dispatch) => {
    dispatch({
        type: CREATING_CUSTOM_USER
    })
    const exists = await AnyListUser.fetchList({
        username
    })    

    console.log(exists)
    if (exists.length > 0) {
        console.log("user already exists")
    } else {
        const newuser = new AnyListUser({
            name: profile.name,
            username,
            description: profile.description
        });

        const res = await newuser.save();
        
        dispatch({
            type: CUSTOM_USER_CREATED,
            payload: newuser
        })
    }
}
