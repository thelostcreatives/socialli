import * as actions from '../actions';

const initialState = {
	socialliConfig: null
}

const branchTable = {
	[actions.SOCIALLI_CONFIG_RECIEVED]: (state, action) => {
		return {
			...state, 
			socialliConfig: action.payload ? action.payload : state.socialliConfig
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}