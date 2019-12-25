import { EditorState, convertToRaw } from 'draft-js';
import * as actions from '../actions';

const initialState = {
	feedPosts: [],
	listPosts: [],
	lists: {},
	searchString: "",
	searchResults: [],
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

		const hash = {};
		return {
			...state,
			isGettingPosts: false,
			feedPosts: [...state.feedPosts, ...action.payload].filter((v, i, s) => {
				if (!Object.keys(hash).includes(v._id)){
					hash[v._id] = 0;
					return true;
				} else {
					return false;
				}
			}),
			feedHasMore: hasMore
		}
	},
	[actions.SET_SEARCH_STRING]: (state, action) => {

		return {
			...state, 
			searchString: action.payload,
			searchResults: []
		}
	},
	[actions.RECEIVED_SEARCHED_POSTS]: (state, action) => {
		let hasMore = true;
		if (action.payload.length === 0) {
			hasMore = false;
		}

		const hash = {};

		return {
			...state, 
			searchResults: [...state.searchResults, ...action.payload].filter((v, i, s) => {
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
	[actions.RECEIVED_POSTS]: (state, action) => {
		let hasMore = true;
		if (action.payload.length === 0) {
			hasMore = false;
		}

		const hash = {};
		return {
			...state,
			isGettingPosts: false,
			listPosts: [...state.listPosts, ...action.payload].filter((v, i, s) => {
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
	[actions.RECEIVED_LIST_POSTS]: (state, action) => {
		let hasMore = true;
		if (action.payload.length === 0) {
			hasMore = false;
		}

		const hash = {};

		if (!state.lists[action.listId]) {
			state.lists[action.listId] = [];
		}
		return {
			...state,
			isGettingPosts: false,
			lists: {
				...state.lists, 
				[action.listId]: [...state.lists[action.listId], ...action.payload].filter((v, i, s) => {
					if (!Object.keys(hash).includes(v._id)){
						hash[v._id] = 0;
						return true;
					} else {
						return false;
					}
				})
			},
			listHasMore: hasMore
		}
	},
	[actions.POST_CREATED]: (state, action) => {
		if (!state.lists[action.listId]) {
			state.lists[action.listId] = [];
		}
		return {
			...state,
			lists: {
				...state.lists, 
				[action.listId]: [action.payload, ...state.lists[action.listId]]
			}
		}
	},
	[actions.SET_EXPANDED_POST]: (state, action) => {
		return {
			...state,
			expandedPost: action.payload
		}
	},
	[actions.POST_UPDATED]: (state, action) => {
		return {
			...state,
			expandedPost: action.payload
		}
	},
	[actions.DELETED_POST]: (state, action) => {
		const deletedPost = action.payload;
		const {listId}  = deletedPost.attrs;
		return {
			...state,
			lists: {
				...state.lists, 
				[listId]: [...state.lists[listId]].filter(post => post._id !== deletedPost._id)
			}
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}