import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, Modifier, convertToRaw } from 'draft-js';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

import { Button } from './index';
import { createComment, setActiveList } from '../actions';
import { List } from '../models';

const NewCommentForm = (props) => {
	const { 
		createPost,
		setActiveList,
		post,
		// listData,
		anylistUser,
		match,
		done,
		createComment
	} = props;

	// const { author, title } = listData;

	const { username } = anylistUser.attrs;

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
			await createComment(
				post._id,
				{
					commentAuthor: username
				},
				convertToRaw(contentState)
			);
			setEditorState(EditorState.createEmpty());
		} else {
			console.log("Tell us what you think meyn");
		}
	}

	const toggleEmojiPicker = () => {
		setIsEmojiPickerVisible(!isEmojiPickerVisible);
	}

	const handleEmojiClick = (emoji, data) => {
		const selection = editorState.getSelection();
		const contentState = editorState.getCurrentContent();
		const newState =  Modifier.insertText(contentState, selection, String.fromCodePoint(`0x${emoji}`))
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
					<Button onClick = {handlePost} text = "Comment"/>
					{ isEmojiPickerVisible ? 
						<EmojiPicker onEmojiClick={handleEmojiClick}/>
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
	}
}

export default connect(mstp, {createComment})(NewCommentForm);

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
`;

const OptionsBar = styled.div`
	display: flex;
	justify-content: space-between;
	position: relative;

	.emoji-picker {
		position: absolute;
		top: 100%;
		z-index: 100;
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