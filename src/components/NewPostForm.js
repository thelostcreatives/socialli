import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import styled from 'styled-components';

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
		await createPost(
			listData._id,
			{
				listAuthor: author,
				listTitle: title
			},
			convertToRaw(editorState.getCurrentContent())
		);
		history.push(`/profile/${listData._id}`);
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
				<Button onClick = {handlePost}>Post</Button>
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
`;

const Button = styled.div`
	background-color: #599bb3;
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
		background-color: #408c99;
	}
	&:active {
		position: relative;
		top: 1px;
	}
`;