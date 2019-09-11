import * as actions from '../actions';

const initialState = {}

const branchTable = {
    [actions.SIGNIN]: (state, action) => {
        return {...state}
    },
    [actions.SIGNOUT]: (state, action) => {
        return {...state}
    },
    [actions.STOREUSERSESSION]: (state, action) => {
        return {...state, userSession: action.payload}
    }


}
export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}
