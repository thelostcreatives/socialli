import { Notification } from '../models';
import { USER_UPDATED } from './index';
import { descendSortModels } from '../utils/helpers';

export const CREATING_NOTIF = "CREATING_NOTIF";
export const NOTIF_CREATED = "NOTIF_CREATED";

export const GETTING_NOTIFS = "GETTING_NOTIFS";
export const NOTIFS_RECEIVED = "NOTIFS_RECEIVED";

export const GETTING_NEW_NOTIFS_COUNT = "GETTING_NEW_NOTIFS_COUNT";
export const NEW_NOTIFS_COUNT_RECEIVED = "NEW_NOTIFS_COUNT_RECEIVED";

export const UPDATING_NOTIF = "UPDATING_NOTIF";
export const NOTIF_UPDATED = "NOTIF_UPDATED";

export const DELETING_NOTIF = "DELETING_NOTIF";
export const NOTIF_DELETED = "NOTIF_DELETED";

export const SETTING_LAST_SEEN_NOTIF = "SETTING_LAST_SEEN_NOTIF";

export const createNotif = (author, notif_for, notif_with, type, content, mentions = []) => async (dispatch) => {
	dispatch({
		type: CREATING_NOTIF
	});

	const newNotif = new Notification({
		author,
		notif_for,
		notif_with,
		type,
		content,
		mentions
	});

	const notif = await newNotif.save();

	dispatch({
		type: NOTIF_CREATED,
		payload: notif
	});
}

export const getNotifs = (username, subbed_models, offset, limit) => async (dispatch) => {
	dispatch({
		type: GETTING_NOTIFS
	});

	let subbed_models_notifs = [];

	if (subbed_models.length > 0) { 
		subbed_models_notifs = await Notification.fetchList({
			offset,
			limit,
			author: {
				$ne: username
			},
			notif_for: subbed_models,
			sort: '-createdAt'
		});
	}

	const mentions_notifs = await Notification.fetchList({
		offset,
		limit,
		author: {
			$ne: username
		},
		mentions: username,
		sort: '-createdAt'
	});

	const notifs = [...subbed_models_notifs, ...mentions_notifs].sort(descendSortModels); 

	dispatch({
		type: NOTIFS_RECEIVED,
		payload: notifs
	});
}

export const getNewNotifsCount = (username, subbed_models, lastSeen) => async (dispatch) => {
	dispatch({
		type: GETTING_NEW_NOTIFS_COUNT
	});

	let subbed_models_notifs = [];

	if (subbed_models.length > 0 ) {
		subbed_models_notifs = await Notification.fetchList({
			author: {
				$ne: username
			},
			notif_for: subbed_models,
			createdAt: {
				$gt: lastSeen
			}
		});
	}

	const mentions_notifs = await Notification.fetchList({
		author: {
			$ne: username
		},
		mentions: username,
		createdAt: {
			$gt: lastSeen
		}
	});

	const notifs = [...subbed_models_notifs, ...mentions_notifs];

	dispatch({
		type: NEW_NOTIFS_COUNT_RECEIVED,
		payload: notifs.length
	});
}

export const setLastSeenNotif = (anylistUser, notif) => async (dispatch) => {
	dispatch({
		type: SETTING_LAST_SEEN_NOTIF
	});

	anylistUser.update({
		other: {
			...anylistUser.attrs.other,
			lastSeenNotif: notif.attrs.createdAt
		}
	});

	const updatedUser = await anylistUser.save();

	dispatch({
		type: USER_UPDATED,
		payload: updatedUser
	});

}

export const updateNotif = (notif_with, updates) => async (dispatch) => {
	dispatch({ 
		type: UPDATING_NOTIF
	});

	const notif = await Notification.fetchList({
		notif_with
	});

	if (notif[0]) {
		notif[0].update(updates);
		await notif[0].save();
	}

	dispatch({ 
		type: NOTIF_UPDATED,
	});
}

export const deleteNotif = (notif_with) => async (dispatch) => {
	dispatch({
		type: DELETING_NOTIF
	});

	const notif = await Notification.fetchList({
		notif_with
	});

	if (notif[0]) {
		await notif[0].destroy();
	}

	dispatch({
		type: NOTIF_DELETED,
		payload: notif
	});
}