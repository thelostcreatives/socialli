import { Post } from '../models';
import { USER_UPDATED } from './index';
import { uploadFile, HANDLE_REGEX, HASHTAG_REGEX, getMatchesFromString, descendSortModels } from '../utils/helpers';

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

export const UPLOADING_IMAGES = "UPLOADING_IMAGES";
export const IMAGES_UPLOADED = "IMAGES_UPLOADED";

export const SET_SEARCH_STRING = "SET_SEARCH_STRING";

export const SEARCHING_POSTS = "SEARCHING_POSTS";
export const RECEIVED_SEARCHED_POSTS = "RECEIVED_SEARCHED_POSTS";

export const createPost = (listId, metadata, content, mentions, hashtags, imgs ) => async (dispatch) => {
    dispatch({
        type: CREATING_POST
	});

	const newPost = new Post({
		listId,
		metadata,
		content,
		mentions,
		hashtags,
		other: imgs ? 
			{
				images: imgs
			}
			:
			{}
	});

	const post = await newPost.save();

    dispatch({
		type: POST_CREATED,
		payload: post,
		listId
    });

	return post;
}

export const getPosts = (offset, limit = 5, listId) => async (dispatch) => {
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

export const getFeedPosts = (followedLists, offset, limit = 5) => async (dispatch) => {
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

export const setSearchString = (searchString) => { 
	return {
		type: SET_SEARCH_STRING,
		payload: searchString
	}
}

export const searchPosts = (searchString, offset, limit = 5) => async (dispatch) => { 
	dispatch({ 
		type: SEARCHING_POSTS
	});

	const mentions = getMatchesFromString(HANDLE_REGEX, searchString).map(mention => mention.substr(1));
	const hashtags = getMatchesFromString(HASHTAG_REGEX, searchString).map(hashtag => hashtag.substr(1));

	let postsWithMentions = [];
	let postsWithHashtags = [];

	if (mentions.length > 0) {
		postsWithMentions = await Post.fetchList({ 
			offset,
			limit,
			mentions: mentions,
			sort: '-createdAt'
		});
	}

	if (hashtags.length > 0) { 
		postsWithHashtags = await Post.fetchList({ 
			offset,
			limit,
			hashtags: hashtags,
			sort: '-createdAt'
		});
	}

	const searchResults = [...postsWithMentions, ...postsWithHashtags].sort(descendSortModels);

	dispatch({ 
		type: RECEIVED_SEARCHED_POSTS,
		payload: searchResults
	});
}


export const setExpandedPost = (post) => {
	return {
		type: SET_EXPANDED_POST,
		payload: post
	}
}

export const updatePost = (post, content, mentions, hashtags) => async (dispatch) => {
	dispatch({
		type: UPDATING_POST
	});

	post.update({
		content,
		mentions,
		hashtags
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

	const posts = [...anylistUser.attrs.followedPosts, postId];

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
        followedPosts: [...followedPosts]
    });

    const updatedUser = await anylistUser.save();

    dispatch({
        type: USER_UPDATED,
        payload: updatedUser 
    });
}

export const uploadImages = (userSession, user, images) => async (dispatch) => {
	dispatch({
		type: UPLOADING_IMAGES
	});

	const links = await Promise.all(images.map(image => uploadFile(userSession, "img_posts", image, {encrypt:false})));

    dispatch({
        type: IMAGES_UPLOADED,
	});
	
	return links;
}