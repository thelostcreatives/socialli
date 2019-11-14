import * as actions from '../actions';

const initialState = {
	creatingComment: false,
	totals: {},
}

const branchTable = {
	[actions.CREATING_COMMENT]: (state, action) => {
		return {
			...state,
			creatingComment: true,
			totals: { ...state.totals, [action.postId]: state.totals[action.postId] ++}
		}
	},
	[actions.COMMENT_CREATED]: (state, action) => {
		return {
			...state,
			creatingComment: false,
			[action.postId]: state[action.postId] ? [...state[action.postId], action.payload] : [action.payload]
		}
	},
	[actions.COMMENTS_RECEIVED]: (state, action) => {

		const hash = {};
		
		return {
			...state,
			[action.postId]: state[action.postId] ? [...action.payload.reverse(), ...state[action.postId]].filter((v, i, s) => {
					if (!Object.keys(hash).includes(v._id)){
						hash[v._id] = 0;
						return true;
					} else {
						return false;
					}
				}) : [...action.payload].reverse(),
			totals: {
				...state.totals,
				[action.postId]: action.total
			}
		}
	},
	[actions.COMMENT_DELETED]: (state, action) => {
		const deletedComment = action.payload;
		const { postId } = deletedComment.attrs;
		return {
			...state,
			[postId]: state[postId].filter((comment) => comment._id !== deletedComment._id)
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}