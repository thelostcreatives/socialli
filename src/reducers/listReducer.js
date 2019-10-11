import * as actions from '../actions';

const initialState = {
	activeList: {
		attrs: {
			signingKeyId: null
		}
	},
	profileLists: [],
	deletingList: false
}

const branchTable = {
	[actions.SET_ACTIVE_LIST]: (state, action) => {
		return {
			...state, activeList: action.payload
		}
	},
	[actions.RECEIVED_PROFILE_LISTS]: (state, action) => {
		return {
			...state,
			profileLists: [...action.payload]
		}
	},
	[actions.LIST_UPDATED]: (state, action) => {
		return {
			...state, activeList: action.payload
		}
	},
	[actions.DELETING_LIST]: (state, action) => {
		return {
			...state,
			deletingList: true
		}
	},
	[actions.LIST_DELETED]: (state, action) => {
		return {
			...state,
			profileLists: [...state.profileLists].filter((list) => list._id !== action.payload._id),
			deletingList: false
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}