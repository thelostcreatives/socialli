import { Post } from '../models';
import { USER_UPDATED } from './index';

export const CREATING_POST = "CREATING_POST";
export const POST_CREATED = "POST_CREATED";

export const GETTING_POSTS = "GETTING_POSTS";
export const RECEIVED_POSTS = "RECEIVED_POSTS";
export const RECEIVED_LIST_POSTS = "RECEIVED_LIST_POSTS";

export const UPDATING_POST = "UPDATING_POST";
export const POST_UPDATED = "POST_UPDATED";

export const DELETING_POST = "DELETING_POST";
export const DELETED_POST = "DELETED_POST";

export const GETTING_FEED_POSTS = "GETTING_FEED_POSTS";
export const RECEIVED_FEED_POSTS = "RECEIVED_FEED_POSTS";

export const SET_EXPANDED_POST = "SET_EXPANDED_POST";

export const ADDING_POST_TO_FOllOWS = "ADDING_POST_TO_FOllOWS";
export const REMOVING_POST_FROM_FOLLOWS = "REMOVING_POST_FROM_FOLLOWS";

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

export const updatePost = (post, content) => async (dispatch) => {
	dispatch({
		type: UPDATING_POST
	});

	post.update({
		content
	});

	const updatedPost = await post.save();

	dispatch({
		type: POST_UPDATED,
		payload: updatedPost
	});
}

export const deletePost = (post) => async (dispatch) => {
	dispatch({
		type: DELETING_POST
	});

	await post.destroy();

	dispatch({
		type: DELETED_POST,
		payload: post
	});

}

export const followPost = (anylistUser, postId) => async (dispatch) => {
	dispatch({
		type: ADDING_POST_TO_FOllOWS
	});

	const posts = [...anylistUser.attrs.followedLists, postId];

    anylistUser.update({
        followedPosts: posts.filter((v, i, s) => s.indexOf(v) === i)
    });

    const updatedUser = await anylistUser.save();

    dispatch({
        type:   USER_UPDATED,
        payload: updatedUser
    });
}

export const unfollowPost = (anylistUser, postId) => async (dispatch) => {
    dispatch({
        type: REMOVING_POST_FROM_FOLLOWS
    });

    const { followedPosts } = anylistUser.attrs;
    followedPosts.splice(followedPosts.indexOf(postId), 1);

    anylistUser.update({
        followedLists: [...followedPosts]
    });

    const updatedUser = await anylistUser.save();

    dispatch({
        type: USER_UPDATED,
        payload: updatedUser 
    })
}