import { Post } from '../models';

export const CREATING_POST = "CREATING_POST";
export const POST_CREATED = "POST_CREATED";

export const createPost = (listId, content) => async (dispatch) => {
    dispatch({
        type: CREATING_POST
    });

	const newPost = new Post({
		listId,
		content
	});

	const post = await newPost.save();

    dispatch({
        type: POST_CREATED 
    });

	return post;
}
