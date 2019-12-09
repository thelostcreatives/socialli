import * as actions from '../actions';
import { SocialliConfig } from '../models';

const initialState = {
	socialliConfig: {
		attrs: {}
	}
}

const branchTable = {
	[actions.SOCIALLI_CONFIG_CREATED]: (state, action) => {
		return {
			...state, 
			socialliConfig: action.payload
		}
	},
	[actions.SOCIALLI_CONFIG_RECIEVED]: (state, action) => {
		return {
			...state, 
			socialliConfig: action.payload ? action.payload : state.socialliConfig
		}
	},
	[actions.SOCIALLI_CONFIG_UPDATED]: (state, action) => {
		return {
			...state,
			socialliConfig: new SocialliConfig(action.payload.attrs)
		}
	}
}

export default (state = initialState, action) => {
    return action.type in branchTable ? branchTable[action.type](state, action) : state;
}