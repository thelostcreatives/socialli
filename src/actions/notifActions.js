import { Notification } from '../models';

export const notif_types= {
	post: "POST",
	comment: "COMMENT",
}

export const CREATING_NOTIF = "CREATING_NOTIF";
export const NOTIF_CREATED = "NOTIF_CREATED";

export const GETTING_NOTIFS = "GETTING_NOTIFS";
export const NOTIFS_RECEIVED = "NOTIFS_RECEIVED";

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

export const getNotifs = (username, subbed_models) => async (dispatch) => {
	dispatch({
		type: GETTING_NOTIFS
	});

	const notifs = await Notification.fetchList({
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
}