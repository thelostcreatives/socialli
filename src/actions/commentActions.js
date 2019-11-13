import { Comment } from '../models';

export const CREATING_COMMENT = 'CREATING_COMMENT';
export const COMMENT_CREATED = 'COMMENT_CREATED';

export const GETTING_COMMENTS = 'GETTING_COMMENTS';
export const COMMENTS_RECEIVED = "COMMENTS_RECEIVED";

export const UPDATING_COMMENT = 'UPDATING_COMMENT';
export const COMMENT_UPDATED = 'COMMENT_UPDATED';

export const DELETING_COMMENT = 'DELETING_COMMENT';
export const COMMENT_DELETED = 'COMMENT_DELETED';

export const createComment = (postId, metadata, content) => async (dispatch) => {
	dispatch({
		type: CREATING_COMMENT
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

	return comment;
}

export const getComments = (offset, limit, postId) => async (dispatch) => {
	dispatch({
		type: GETTING_COMMENTS
	});

	let comments;

	const total = await Comment.count({
		postId
	});

	if (!limit) {
		comments = await Comment.fetchList({
			postId,
			sort: '-createdAt'
		});
	} else {
		comments = await Comment.fetchList({
			offset,
			limit,
			postId,
			sort: '-createdAt'
		});
	}

	dispatch({
		type: COMMENTS_RECEIVED,
		postId,
		total,
		payload: comments
	});
}

export const updateComment = (comment, content) => async (dispatch) => {
	dispatch({
		type: UPDATING_COMMENT
	});

	comment.update({
		content
	});

	const updatedPost = await comment.save();

	dispatch({
		type: COMMENT_UPDATED,
		payload: updatedPost
	});
}

export const deleteComment = (comment) => async (dispatch) => {
	dispatch({
		type: DELETING_COMMENT
	});

	await comment.destroy();

	dispatch({
		type: COMMENT_DELETED,
		payload: comment
	});

}