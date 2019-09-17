import * as actions from '../actions';

const initialState = {}

const branchTable = {
	[actions.SET_ACTIVE_LIST]: (state, action) => {
		return {
			...state, activeList: action.payload
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}