import { List } from '../models';

export const CREATING_LIST = "CREATING_LIST";
export const SET_ACTIVE_LIST = "SET_ACTIVE_LIST";

export const createList = async (title, description, posts_type) => {
	const newList = new List({
		title,
		description,
		posts_type
	})

	const listdata = await newList.save();
	return listdata;
}

export const setActiveList = (list) => {
	return {
		type: SET_ACTIVE_LIST,
		payload: list
	}
}