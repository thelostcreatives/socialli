import { Comment } from '../models';

export const CREATE_COMMENT = 'CREATE_COMMENT';
export const COMMENT_CREATED = 'COMMENT_CREATED';

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
		payload: comment
	});
}