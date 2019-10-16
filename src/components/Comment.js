import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Editor, EditorState, Modifier, convertToRaw, convertFromRaw } from 'draft-js';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

const Comment = (props) => {

	console.log(props)

	const { comment } = props;

	const { content, metadata } = comment.attrs;

	const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));
	const [isEditing, setIsEditing] = useState(false);

	const editor = useRef(null);

	const stopPropagation = (e) => e.stopPropagation();

	return (
		<div>
			<Link to = {`/${metadata ? metadata.commentAuthor: null}`} className = "author" onClick = {stopPropagation}>
				{metadata ? `@${metadata.commentAuthor}` : null}
			</Link>
			<Editor
				ref = {editor}
				editorState = {editorState}
				onChange = {editorState => setEditorState(editorState)}
				readOnly = {!isEditing}

			/>
		</div>
	)
}

export default Comment;