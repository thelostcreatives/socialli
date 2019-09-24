import { List } from '../models';

export const CREATING_LIST = "CREATING_LIST";
export const LIST_CREATED = "LIST_CREATED";
export const SET_ACTIVE_LIST = "SET_ACTIVE_LIST";

export const ADDING_LIST_TO_FOLLOWS = "ADDING_LIST_TO_FOLLOWS";
export const LIST_ADDED_TO_FOLLOWS = "LIST_ADDED_TO_FOLLOWS";

export const createList = (title, description, author, posts_type) => async (dispatch) => {
    dispatch({
        type: CREATING_LIST
    });

	const newList = new List({
		title,
        description,
        author,
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

export const followList = (anylistUser, listId) => async (dispatch) => {
    dispatch({
        type: ADDING_LIST_TO_FOLLOWS
    });

    anylistUser.update({
        followedLists: [...anylistUser.attrs.followedLists, listId]
    });

    const updatedUser = await anylistUser.save();

    dispatch({
        type:   LIST_ADDED_TO_FOLLOWS,
        payload: updatedUser
    });
}
