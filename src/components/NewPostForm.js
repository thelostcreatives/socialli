import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, Modifier, convertToRaw } from 'draft-js';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

import { createPost, setActiveList } from '../actions';
import { List } from '../models';

const NewPostForm = (props) => {
	const { 
		createPost,
		setActiveList,
		listData,
		match,
		history 
	} = props;

	const { author, title } = listData;

	const [media, setMedia] = useState("");
	const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const editor = useRef(null);

	const focusEditor = () => {
		editor.current.focus();
	}

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${match.params.id}`);
			return data;
		}
		if (listData._id !== match.params.id) {
			getListData().then(data => {
				setActiveList(data);
			});
		}
	}, [listData]);

	useEffect (() => {
		focusEditor();
	}, []);

	const handlePost = async () => {
		const contentState = editorState.getCurrentContent(); 
		if (contentState.hasText()) {
			await createPost(
				listData._id,
				{
					listAuthor: author,
					listTitle: title
				},
				convertToRaw(contentState)
			);
			history.push(`/profile/${listData._id}`);
		} else {
			console.log("Tell us stories meyn");
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
		<NewPostFormWrapper onClick = {focusEditor}>
			<Editor
				ref = {editor}
				editorState = {editorState}
				onChange = {editorState => setEditorState(editorState)}
				placeholder = {"Share your story..."}
			/>
			<OptionsBar>
				<Button onClick = {toggleEmojiPicker} bgColor = "grey">Emoji</Button>
				<Button onClick = {handlePost}>Post</Button>
				{ isEmojiPickerVisible ? 
					<EmojiPicker onEmojiClick={handleEmojiClick}/>
					:
					null
				}
			</OptionsBar>
		</NewPostFormWrapper>
	);
}

const mstp = (state) => {
	return {
		listData: state.lists.activeList.attrs
	}
}

export default connect(mstp, {createPost, setActiveList})(NewPostForm);

const NewPostFormWrapper = styled.div`
	font-family: 'Work Sans', sans-serif;
	
	width: 500px;
	-webkit-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
	-moz-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
	box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);

	padding: 10px;
	border-radius: 10px;
	.DraftEditor-root{
		min-height: 100px;
	}
`;

const OptionsBar = styled.div`
	display: flex;
	justify-content: flex-end;
	position: relative;

	.emoji-picker {
		position: absolute;
		top: 100%;
	}
`;

const Button = styled.button`
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