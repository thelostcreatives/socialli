import { List, Post } from '../models';
import { USER_UPDATED } from './index';
import { uploadFile } from '../utils/helpers';

export const CREATING_LIST = "CREATING_LIST";
export const LIST_CREATED = "LIST_CREATED";

export const GETTING_PROFILE_LISTS = "GETTING_PROFILE_LISTS";
export const RECEIVED_PROFILE_LISTS = "RECEIVED_PROFILE_LISTS";

export const SET_ACTIVE_LIST = "SET_ACTIVE_LIST";

export const ADDING_LIST_TO_FOLLOWS = "ADDING_LIST_TO_FOLLOWS";
export const LIST_ADDED_TO_FOLLOWS = "LIST_ADDED_TO_FOLLOWS";
export const REMOVING_LIST_FROM_FOLLOWS = "REMOVING_LIST_FROM_FOLLOWS";

export const UPDATING_LIST = "UPDATING_LIST";
export const LIST_UPDATED = "LIST_UPDATED";

export const DELETING_LIST = "DELETING_LIST";
export const LIST_DELETED = "LIST_DELETED";

export const UPLOADING_LIST_BANNER = "UPLOADING_LIST_BANNER";
export const LIST_BANNER_UPLOADED = "LIST_BANNER_UPLOADED";

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

export const getProfileLists = (username) => async (dispatch) => {

    dispatch({
        type: GETTING_PROFILE_LISTS,
    });

    if (username) {
        const profileLists = await List.fetchList({
            author: username
        });

        dispatch({
            type: RECEIVED_PROFILE_LISTS,
            payload: profileLists,
        });
    } else {
        dispatch({
            type: RECEIVED_PROFILE_LISTS,
            payload: [],
        });
    }
    
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

    const follows = [...anylistUser.attrs.followedLists, listId];

    anylistUser.update({
        followedLists: follows.filter((v, i, s) => s.indexOf(v) === i)
    });

    const updatedUser = await anylistUser.save();

    dispatch({
        type:   USER_UPDATED,
        payload: updatedUser
    });
}

export const unfollowList = (anylistUser, listId) => async (dispatch) => {
    dispatch({
        type: REMOVING_LIST_FROM_FOLLOWS
    });

    const { followedLists } = anylistUser.attrs;
    followedLists.splice(followedLists.indexOf(listId), 1);

    anylistUser.update({
        followedLists: [...followedLists]
    });

    const updatedUser = await anylistUser.save();

    dispatch({
        type: USER_UPDATED,
        payload: updatedUser 
    })
}

export const updateList = (list, updates) => async (dispatch) => {
    dispatch({
        type: UPDATING_LIST
    });

    list.update(updates);

    const updatedList = await list.save();

    dispatch({
        type: LIST_UPDATED,
        payload: updatedList
    });
}

export const deleteList = (list, redirect) => async (dispatch) => {
    dispatch({
        type: DELETING_LIST
    });

    const posts = await Post.fetchList({
        listId: list._id
    });

    await Promise.all(posts.map(post => post.destroy()));

    await list.destroy();

    dispatch({
        type: LIST_DELETED,
        payload: list
    });

    redirect();
}

export const uploadBanner = (userSession, list, file) => async (dispatch) => {
    dispatch({
        type: UPLOADING_LIST_BANNER
    });

    const link = await uploadFile(userSession, "listBanners", file, {encrypt:false});

    list.update({
        other: {
            bannerLink: link
        }
    });

    const updatedList = await list.save();

    dispatch({
        type: LIST_UPDATED,
        payload: updatedList
    });
}