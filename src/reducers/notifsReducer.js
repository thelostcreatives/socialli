import * as actions from '../actions';

const initialState = {

};

const branchTable = {
	[actions.CREACTING_NOTIF]: (state, action) => {
		return {
			...state,
			notifications: [action.payload, ...state.notifications]
		}
	}
};

export default (state = initialState, action) => {
	return action.type in branchTable ? branchTable[action.type](state, action) : state;
}

