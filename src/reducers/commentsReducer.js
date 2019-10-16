import * as actions from '../actions';

const initialState = {

}

const branchTable = {
	[actions.COMMENT_CREATED]: (state, action) => {
		return {
			...state,
			[action.postId]: state[action.postId] ? [...state[action.postId], action.payload] : [action.payload]
		}
	},
	[actions.COMMENTS_RECEIVED]: (state, action) => {

		const hash = {};
		
		return {
			...state,
			[action.postId]: state[action.postId] ? [...state[action.postId], ...action.payload].filter((v, i, s) => {
					if (!Object.keys(hash).includes(v._id)){
						hash[v._id] = 0;
						return true;
					} else {
						return false;
					}
				}).reverse() : [...action.payload].reverse()
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}