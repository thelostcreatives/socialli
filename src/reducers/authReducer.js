import * as actions from '../actions';

const initialState = {
    anylistUser: {
        attrs: {
            followedLists: []
        }
    },
    activeProfile: {
        attrs: {

        }
    },
    users: {},
    uploadingAvatar: false
}

const branchTable = {
    [actions.SIGNIN]: (state, action) => {
        return {...state}
    },
    [actions.SIGNOUT]: (state, action) => {
        return {...state}
    },
    [actions.STOREUSERSESSION]: (state, action) => {
        return {...state, userSession: action.payload}
    },
    [actions.GETTING_CUSTOM_USER]: (state, actions) => {
        return {...state, findingUser: true}
    },
    [actions.CUSTOM_USER_FOUND]: (state, actions) => {
        return {
            ...state,
            findingUser: false,
            anylistUser: actions.payload,
            users: {
                ...state.users, 
                [actions.payload.attrs.signingKeyId]: actions.payload
            }
        }
    },
    [actions.USER_DATA_RECIEVED]: (state, actions) => {
        return {
            ...state,
            users: {
                ...state.users, 
                [actions.payload.attrs.signingKeyId]: actions.payload
            }
        }
    },
    [actions.USER_UPDATED]: (state, actions) => {
        return {
            ...state,
            anylistUser: actions.payload,
            activeProfile: actions.payload,
            uploadingAvatar: false
        }
    },
    [actions.SET_ACTIVE_PROFILE]: (state, actions) => {
        return {
            ...state,
            activeProfile: actions.payload
        }
    },
    [actions.UPLOADING_AVATAR]: (state, actions) => {
        return {
            ...state,
            uploadingAvatar: true
        }
    }
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}
