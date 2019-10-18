import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { Comment, NewCommentForm } from './index';
import { getComments } from '../actions';

const Comments = (props) => {
	const { post, comments, getComments } = props;

	useEffect (() => {
		if(post && !comments){
			getComments(0, false, post._id);
		}
	}, [post, comments]);

	return (
		<>
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
		comments: state.comments[postId]
	}
}

export default connect(mstp, {getComments})(Comments);