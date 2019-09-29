import { EditorState, convertToRaw } from 'draft-js';
import * as actions from '../actions';

const initialState = {
	feedPosts: [],
	listPosts: [],
	isGettingPosts: false,
	expandedPost: {
		attrs: {
			_id: null,
			content: convertToRaw(EditorState.createEmpty().getCurrentContent())
		}
	}
}

const branchTable = {
	[actions.GETTING_POSTS]: (state, action) => {
		return {
			...state, 
			isGettingPosts: true
		}
	},
	[actions.RECEIVED_FEED_POSTS]: (state, action) => {
		let hasMore = true;
		if (action.payload.length === 0) {
			hasMore = false;
		}
		return {
			...state,
			isGettingPosts: false,
			feedPosts: [...state.feedPosts, ...action.payload].filter((v, i, s) => s.indexOf(v) === i),
			feedHasMore: hasMore
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