import * as actions from '../actions';

const initialState = {
	feedPosts: [],
	listPosts: [],
	isGettingPosts: false
}

const branchTable = {
	[actions.GETTING_POSTS]: (state, action) => {
		return {
			...state, 
			isGettingPosts: true
		}
	},
	[actions.RECEIVED_FEED_POSTS]: (state, action) => {
		return {
			...state,
			isGettingPosts: false,
			feedPosts: [...state.feedPosts, ...action.payload].filter((v, i, s) => s.indexOf(v) === i)
		}
	},
	[actions.RECEIVED_POSTS]: (state, action) => {
		return {
			...state,
			isGettingPosts: false,
			listPosts: [...state.listPosts, ...action.payload].filter((v, i, s) => s.indexOf(v) === i)
		}
	},
	[actions.SET_EXPANDED_POST]: (state, action) => {
		return {
			...state,
			expandedPost: action.payload
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}