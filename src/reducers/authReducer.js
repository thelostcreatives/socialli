import * as actions from '../actions';

const initialState = {
    anylistUser: {
        attrs: {
            followedLists: []
        }
    }
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
            anylistUser: actions.payload
        }
    },
    [actions.LIST_ADDED_TO_FOLLOWS]: (state, actions) => {
        return {
            ...state,
            anylistUser: actions.payload
        }
    }

}
export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}
