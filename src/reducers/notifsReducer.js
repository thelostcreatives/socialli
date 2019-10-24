import * as actions from '../actions';

const initialState = {
	notifications: []
};

const branchTable = {
	[actions.NOTIF_CREATED]: (state, action) => {
		return {
			...state,
			notifications: [action.payload, ...state.notifications]
		}
	},
	[actions.NOTIFS_RECEIVED]: (state, action) => {
		return {
			...state,
			notifications: [...action.payload, ...state.notifications]
		}
	}
};

export default (state = initialState, action) => {
	return action.type in branchTable ? branchTable[action.type](state, action) : state;
}

