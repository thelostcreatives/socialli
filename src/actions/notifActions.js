import { Notification } from '../models';
import { USER_UPDATED } from './index';

export const notif_types= {
	post: "POST",
	comment: "COMMENT",
}

export const CREATING_NOTIF = "CREATING_NOTIF";
export const NOTIF_CREATED = "NOTIF_CREATED";

export const GETTING_NOTIFS = "GETTING_NOTIFS";
export const NOTIFS_RECEIVED = "NOTIFS_RECEIVED";

export const GETTING_NEW_NOTIFS_COUNT = "GETTING_NEW_NOTIFS_COUNT";
export const NEW_NOTIFS_COUNT_RECEIVED = "NEW_NOTIFS_COUNT_RECEIVED";

export const DELETING_NOTIF = "DELETING_NOTIF";
export const NOTIF_DELETED = "NOTIF_DELETED";

export const SETTING_LAST_SEEN_NOTIF = "SETTING_LAST_SEEN_NOTIF";

export const createNotif = (author, notif_for, notif_with, type, content) => async (dispatch) => {
	dispatch({
		type: CREATING_NOTIF
	});

	const newNotif = new Notification({
		author,
		notif_for,
		notif_with,
		type,
		content
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

	if (subbed_models.length > 0) {
		const notifs = await Notification.fetchList({
			offset,
			limit,
			author: {
				$ne: username
			},
			notif_for: subbed_models,
			sort: '-createdAt'
		});

		dispatch({
			type: NOTIFS_RECEIVED,
			payload: notifs
		});
	} else {
		dispatch({
			type: NOTIFS_RECEIVED,
			payload: []
		});
	}
}

export const getNewNotifsCount = (username, subbed_models, lastSeen) => async (dispatch) => {
	dispatch({
		type: GETTING_NEW_NOTIFS_COUNT
	});

	if (subbed_models.length > 0) {
		const notifs = await Notification.count({
			author: {
				$ne: username
			},
			notif_for: subbed_models,
			createdAt: {
				$gt: lastSeen
			}
		});

		dispatch({
			type: NEW_NOTIFS_COUNT_RECEIVED,
			payload: notifs
		});
	} else {
		dispatch({
			type: NEW_NOTIFS_COUNT_RECEIVED,
			payload: []
		});
	}
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