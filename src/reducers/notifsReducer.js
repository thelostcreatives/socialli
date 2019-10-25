import * as actions from '../actions';

const initialState = {
	notifications: [],
	hasMore: true
};

const branchTable = {
	[actions.SIGNOUT]: (state, action) => {
		return {
			...initialState
		}
	},
	[actions.NOTIFS_RECEIVED]: (state, action) => {
		let hasMore = true;
		if (action.payload.length === 0) {
			hasMore = false;
		}
		return {
			...state,
			notifications: [...action.payload, ...state.notifications],
			hasMore
		}
	}
};

export default (state = initialState, action) => {
	return action.type in branchTable ? branchTable[action.type](state, action) : state;
}

