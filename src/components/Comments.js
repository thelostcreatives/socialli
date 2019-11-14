import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { Comment, NewCommentForm } from './index';
import { getComments } from '../actions';

const Comments = (props) => {
	const { post, comments, totalComments } = props;

	const { getComments } = props

	useEffect (() => {
		if(post._id && !comments){
			getComments(0, 5, post._id);
		}
	}, [post, comments]);

	const handleGetMore = () => {
		getComments(comments.length, 5, post._id);
	}

	return (
		<>
			{comments && comments.length !== totalComments ?
				<FakeLink onClick={handleGetMore}>{`${totalComments - comments.length} more comments`}</FakeLink>
				:
				null
			}
			{
				comments ?
				comments.map(comment => <Comment key = {comment._id} comment = {comment}/>)
				:
				null
			}
			<NewCommentForm post = {post}/>
		</>
	)
}

const mstp = (state) => {
	const postId = state.posts.expandedPost._id;
	return {
		comments: state.comments[postId],
		totalComments: state.comments.totals[postId]
	}
}

export default connect(mstp, {getComments})(Comments);

export const FakeLink = styled.button`
	background: none;
    border: none;
    display: inherit;
	outline: none;
	
	&:hover {
		text-decoration: underline;
		cursor: pointer;
		color: grey
	}
`;