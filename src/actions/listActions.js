import { List } from '../models';

export const CREATING_LIST = "CREATING_LIST";
export const LIST_CREATED = "LIST_CREATED";
export const SET_ACTIVE_LIST = "SET_ACTIVE_LIST";

export const createList = (title, description, posts_type) => async (dispatch) => {
    dispatch({
        type: CREATING_LIST
    });

	const newList = new List({
		title,
		description,
		posts_type
	})

	const listdata = await newList.save();

    dispatch({
        type: LIST_CREATED    
    });

	return listdata;
}

export const setActiveList = (list) => {
	return {
		type: SET_ACTIVE_LIST,
		payload: list
	}
}
