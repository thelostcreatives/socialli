import { Notification } from '../models';

export const notif_types= {
	post: "POST",
	comment: "COMMENT",
}

export const CREATING_NOTIF = "CREATING_NOTIF";
export const NOTIF_CREATED = "NOTIF_CREATED";

export const createNotif = (notif_for, type, content) => async (dispatch) => {
	dispatch({
		type: CREATING_NOTIF
	});

	const newNotif = new Notification({
		notif_for,
		type,
		content
	});

	const notif = await newNotif.save();

	dispatch({
		type: NOTIF_CREATED,
		payload: notif
	});
}