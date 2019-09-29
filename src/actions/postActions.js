import { Post } from '../models';

export const CREATING_POST = "CREATING_POST";
export const POST_CREATED = "POST_CREATED";

export const GETTING_POSTS = "GETTING_POSTS";
export const RECEIVED_POSTS = "RECEIVED_POSTS";
export const RECEIVED_LIST_POSTS = "RECEIVED_LIST_POSTS";

export const GETTING_FEED_POSTS = "GETTING_FEED_POSTS";
export const RECEIVED_FEED_POSTS = "RECEIVED_FEED_POSTS";

export const SET_EXPANDED_POST = "SET_EXPANDED_POST";

export const createPost = (listId, metadata, content) => async (dispatch) => {
    dispatch({
        type: CREATING_POST
    });

	const newPost = new Post({
		listId,
		metadata,
		content
	});

	const post = await newPost.save();

    dispatch({
		type: POST_CREATED,
		payload: post,
		listId
    });

	return post;
}

export const getPosts = (offset, limit, listId) => async (dispatch) => {
	dispatch({
		type: GETTING_POSTS
	});

	let newPosts;

	if (listId) {
		newPosts = await Post.fetchList({
			offset,
			limit,
			listId,
			sort: '-createdAt'
		});
		dispatch({
			type: RECEIVED_LIST_POSTS,
			payload: newPosts,
			listId
		});
	} else {
		newPosts = await Post.fetchList({
			offset,
			limit,
			sort: '-createdAt'
		});
		dispatch({
			type: RECEIVED_POSTS,
			payload: newPosts
		});
	}
}

export const getFeedPosts = (followedLists, offset, limit) => async (dispatch) => {
	dispatch({
		type: GETTING_FEED_POSTS 
	}); 

	if (followedLists.length > 0) {
		const newPosts = await Post.fetchList({
			offset,
			limit,
			listId: followedLists,
			sort: '-createdAt'
		});

		dispatch({
			type: RECEIVED_FEED_POSTS,
			payload: newPosts
		});
	} else {
		dispatch({
			type: RECEIVED_FEED_POSTS,
			payload: []
		});
	}
}

export const setExpandedPost = (post) => {
	return {
		type: SET_EXPANDED_POST,
		payload: post
	}
}