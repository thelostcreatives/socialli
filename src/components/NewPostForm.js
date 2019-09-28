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
			<button onClick = {handlePost}>Post</button>
		</NewPostFormWrapper>
		// <div>
		// 	<input name = "body" type = "text" placeholder = "Say something" value = {body} onChange = {handleInput}/>
		// </div>
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
`;