import { SocialliConfig } from '../models';

export const CREATING_SOCIALLI_CONFIG = "CREATING_SOCIALLI_CONFIG";
export const SOCIALLI_CONFIG_CREATED = "SOCIALLI_CONFIG_CREATED";

export const GETTING_SOCIALLI_CONFIG = "GETTING_SOCIALLI_CONFIG";
export const SOCIALLI_CONFIG_RECEIVED = "SOCIALLI_CONFIG_RECEIVED";

export const UPDATING_SOCIALLI_CONFIG = "UPDATING_SOCIALLI_CONFIG";
export const SOCIALLI_CONFIG_UPDATED = "SOCIALLI_CONFIG_UPDATED";

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

	// configs[0].destroy();

	dispatch({
		type: SOCIALLI_CONFIG_RECEIVED,
		payload: configs[0]
	});

	if (!configs[0] && createConfig) {
		createConfig(host);
	}
}

export const updateSocialliConfig = (config, updates) => async (dispatch) => {
	dispatch({
		type: UPDATING_SOCIALLI_CONFIG
	});

	config.update(updates);

	const updatedConfig = await config.save();

	dispatch({
		type: SOCIALLI_CONFIG_UPDATED,
		payload: updatedConfig
	});
}