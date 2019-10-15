import { Comment } from '../models';

export const CREATE_COMMENT = 'CREATE_COMMENT';
export const COMMENT_CREATED = 'COMMENT_CREATED';

export const GETTING_COMMENTS = 'GETTING_COMMENTS';
export const COMMENTS_RECEIVED = "COMMENTS_RECEIVED";

export const createComment = (postId, metadata, content) => async (dispatch) => {
	dispatch({
		type: CREATE_COMMENT
	});

	const newComment = new Comment({
		postId,
		metadata,
		content
	});

	const comment = await newComment.save();

	dispatch({
		type: COMMENT_CREATED,
		postId,
		payload: comment
	});
}

export const getComments = (offset, limit, postId) => async (dispatch) => {
	dispatch({
		type: GETTING_COMMENTS
	});

	const comments = await Comment.fetchList({
		offset,
		limit,
		postId,
		sort: '-createdAt'
	});

	dispatch({
		type: COMMENTS_RECEIVED,
		postId,
		payload: comments
	});
}