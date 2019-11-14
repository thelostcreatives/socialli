import * as actions from '../actions';

const initialState = {
	notifications: [],
	hasMore: true,
	newNotifs: 0
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

		const hash = {};
		return {
			...state,
			notifications: [...state.notifications, ...action.payload].filter((v, i, s) => {
				if (!Object.keys(hash).includes(v._id)){
					hash[v._id] = 0;
					return true;
				} else {
					return false;
				}
			}),
			hasMore
		}
	},
	[actions.NEW_NOTIFS_COUNT_RECEIVED]: (state, action) => {
		return {
			...state,
			newNotifs: action.payload
		}
	},
	[actions.SETTING_LAST_SEEN_NOTIF]: (state, action) => {
		return {
			...state,
			newNotifs: 0
		}
	}
};

export default (state = initialState, action) => {
	return action.type in branchTable ? branchTable[action.type](state, action) : state;
}

