import { List } from '../models';

export const CREATING_LIST = "CREATING_LIST";

export const createList = async (title, description) => {
	const newList = new List({
		title,
		description
	})

	const listdata = await newList.save();
	return listdata;
}