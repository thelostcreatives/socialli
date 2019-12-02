import { SocialliConfig } from '../models';

export const CREATING_SOCIALLI_CONFIG = "CREATING_SOCIALLI_CONFIG";
export const SOCIALLI_CONFIG_CREATED = "SOCIALLI_CONFIG_CREATED";

export const GETTING_SOCIALLI_CONFIG = "GETTING_SOCIALLI_CONFIG";
export const SOCIALLI_CONFIG_RECIEVED = "SOCIALLI_CONFIG_RECIEVED";

export const createSocialliConfig = (host) => async (dispatch) => {
	dispatch({
		type: CREATING_SOCIALLI_CONFIG
	});

	const newConfig = new SocialliConfig({
		host
	});

	const config = await newConfig.save();

	dispatch({
		type: SOCIALLI_CONFIG_CREATED,
		payload: config
	});
}

export const getSocialliConfig = (host, createConfig) => async (dispatch) => {
	dispatch({
		type: GETTING_SOCIALLI_CONFIG
	});

	const configs = await SocialliConfig.fetchList({
		host
	});

	dispatch({
		type: SOCIALLI_CONFIG_RECIEVED,
		payload: configs[0]
	});

	if (!configs[0]) {
		createConfig(host);
	}
}