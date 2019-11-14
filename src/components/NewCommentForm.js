import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, Modifier, convertToRaw } from 'draft-js';
import styled from 'styled-components';
import { Picker as EmojiPicker } from 'emoji-mart';

import { Button, OptionsBar } from './index';
import { notif_types } from '../actions';
import { createComment, createNotif, followPost } from '../actions';
import { breakpoint } from '../utils/styleConsts';

const NewCommentForm = (props) => {

	const { 
		post,
		anylistUser,
		creatingComment,
	} = props;

	const {
		createComment,
		createNotif,
		followPost
	} = props

	const { username, followedPosts } = anylistUser.attrs;

	const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const editor = useRef(null);

	const focusEditor = () => {
		editor.current.focus();
	}

	useEffect (() => {
		focusEditor();
	}, []);

	const handlePost = async () => {
		const contentState = editorState.getCurrentContent(); 
		if (contentState.hasText()) {
			const newComment = await createComment(
				post._id,
				{
					commentAuthor: username
				},
				convertToRaw(contentState)
			);
			setEditorState(EditorState.createEmpty());

			createNotif(username, post._id, newComment._id, notif_types.comment, {
				...post.attrs.metadata,
				commentAuthor: username
			});

			if (followedPosts.indexOf(post._id) < 0) {
				followPost(anylistUser, post._id);
			}

		} else {
			console.log("Tell us what you think meyn");
		}
	}

	const toggleEmojiPicker = () => {
		setIsEmojiPickerVisible(!isEmojiPickerVisible);
	}

	const handleEmojiClick = (emoji) => {
		const selection = editorState.getSelection();
		const contentState = editorState.getCurrentContent();
		const newState =  Modifier.insertText(contentState, selection, emoji.native)
		const state = EditorState.push(editorState, newState, "insert-characters");
		setEditorState(state);
	}

	return (
		<NewCommentFormWrapper onClick = {focusEditor}>
			<Editor
				ref = {editor}
				editorState = {editorState}
				onChange = {editorState => setEditorState(editorState)}
				placeholder = {"What do you think?..."}
			/>
			<OptionsBar onClick = {e => e.stopPropagation()}>
				<div>
				</div>
				<div>
					<Button onClick = {toggleEmojiPicker} bgColor = "grey" text = "Emoji"/>
					<Button onClick = {handlePost} text = "Comment" disabled = {creatingComment}/>
					{ isEmojiPickerVisible ? 
						<EmojiPicker 
							set = "emojione"
							onSelect = {handleEmojiClick}
						/>
						:
						null
					}
				</div>
			</OptionsBar>
		</NewCommentFormWrapper>
	);
}

const mstp = (state) => {
	return {
		anylistUser: state.auth.anylistUser,
		creatingComment: state.comments.creatingComment
	}
}

export default connect(mstp, {createComment, createNotif, followPost})(NewCommentForm);

const NewCommentFormWrapper = styled.div`
	font-family: 'Work Sans', sans-serif;
	
    height: fit-content;
	-webkit-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
	-moz-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
	box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);

	padding: 10px;
	margin-top: 25px;
	border-radius: 10px;
	.DraftEditor-root{
		min-height: 50px;
	}

	@media only screen and (max-width: ${breakpoint.b}) {
		width: 90vw;
	}

	@media only screen and (min-width: ${breakpoint.b}) {
		width: 500px;
	}
`;

export const StyledButton = styled.button`
	border: 1px solid ${props => props.bgColor ? props.bgColor : "#599bb3"};
	margin: 5px;
	outline: none;
	background-color: ${props => props.bgColor ? props.bgColor : "#599bb3"} ;
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
	border-radius: 5px;
	display: inline-block;
	cursor: pointer;
	color: #ffffff;

	-webkit-font-smoothing: antialiased;
	font-size: 12px;
	line-height: 22px;
	letter-spacing: 1px;
	font-weight: medium;
	padding: 0px 16px;
	text-decoration: none;
	&:hover {
		background-color:  #408c99;
	}
	&:active {
		position: relative;
		top: 1px;
	}
	&:focus {
		border-color: black;
	}
`;