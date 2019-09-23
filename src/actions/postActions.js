import { Post } from '../models';

export const CREATING_POST = "CREATING_POST";
export const POST_CREATED = "POST_CREATED";

export const GETTING_POSTS = "GETTING_POSTS";
export const RECEIVED_POSTS = "RECEIVED_POSTS";

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

export const getPosts = (offset, limit, listId) => async (dispatch) => {
	dispatch({
		type: GETTING_POSTS
	});

	const newPosts = await Post.fetchList({
		offset,
		limit,
		listId,
		sort: '-createdAt'
	});

	dispatch({
		type: RECEIVED_POSTS,
		payload: newPosts
	})
}