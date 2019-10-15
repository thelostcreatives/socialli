import * as actions from '../actions';

const initialState = {

}

const branchTable = {
	[actions.COMMENTS_RECEIVED]: (state, action) => {
		return {
			...state,
			[action.postId]: state[action.postId] ? [...state[action.postId], action.payload] : []
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}