import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { Comment, NewCommentForm } from './index';
import { getComments } from '../actions';

const Comments = (props) => {
	const { post, comments, getComments } = props;

	useEffect (() => {
		getComments(0, 5, post._id);
	}, [post]);

	console.log(comments)

	return (
		<>
			{
				comments ?
				comments.map(comment => {
					return (
						<Comment/>
					)
				})
				:
				null
			}
			<NewCommentForm post = {post}/>
		</>
	)
}

const mstp = (state) => {
	const postId = state.posts.expandedPost._id;

	console.log(postId)

	return {
		comments: state.comments[postId]
	}
}

export default connect(mstp, {getComments})(Comments);