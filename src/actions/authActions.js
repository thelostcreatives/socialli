import  { AnyListUser } from '../models';
import { uploadFile, isImageFileSizeAcceptable, compressImage } from '../utils/helpers';

import { ERROR } from './index';

export const SIGNIN= "SIGNIN";
export const SIGNOUT = "SIGNOUT";
export const STOREUSERSESSION = "STOREUSERSESSION";

export const GETTING_CUSTOM_USER = "GETTING_CUSTOM_USER";
export const CUSTOM_USER_FOUND = "CUSTOM_USER_FOUND";

export const GETTING_USER_DATA = "GETTING_USER_DATA";
export const USER_DATA_RECEIVED = "USER_DATA_RECEIVED";

export const UPDATING_USER = "UPDATING_USER";
export const USER_UPDATED = "USER_UPDATED";

export const SET_ACTIVE_PROFILE = "SET_ACTIVE_PROFILE";

export const UPLOADING_AVATAR = "UPLOADING_AVATAR";

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
            description: profile.description,
            other : {
                avatarUrl: profile.image[0].contentUrl || null,
                lastSeenNotif: Date.now()
            }
        });

        const res = await newuser.save();
        user = res;
    }

    dispatch({
        type: CUSTOM_USER_FOUND,
        payload: user
    });
}

export const getUserData = (signingKeyId) => async (dispatch) => {
    dispatch({
        type: GETTING_USER_DATA
    });

    const user = await AnyListUser.fetchList({
        signingKeyId
    });

    dispatch({
        type: USER_DATA_RECEIVED,
        payload: user[0]
    });
}

export const setActiveProfile = (AnyListUser) => {
    return {
        type: SET_ACTIVE_PROFILE,
        payload: AnyListUser
    }
}

export const updateUser = (AnyListUser, updates) => async (dispatch) => {
    dispatch({
        type: UPDATING_USER
    });

    AnyListUser.update(updates);

    const updatedUser = await AnyListUser.save();

    dispatch({
        type: USER_UPDATED,
        payload: updatedUser
    })
}

export const uploadAvatar = (userSession, user, file) => async (dispatch) => {
    dispatch({
        type: UPLOADING_AVATAR
    });

    let link;

    const process = async () => {
        user.update({
            other: {
                ...user.attrs.other,
                avatarUrl: link
            }
        });

        const updatedUser = await user.save();

        dispatch({
            type: USER_UPDATED,
            payload: updatedUser
        });
    }

    if (isImageFileSizeAcceptable(file.size)) {
        link = await uploadFile(userSession, "avatars", file, {encrypt:false});
        process();
    } else {
        compressImage(file, async (compressed) => { 
            file = compressed;
            link = await uploadFile(userSession, "avatars", file, {encrypt:false});
            process();
        });
    }
}