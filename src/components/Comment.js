import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Edit2, XSquare } from 'react-feather';
import { Editor, EditorState, Modifier, convertToRaw, convertFromRaw } from 'draft-js';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

import { Button } from './index';
import { updateComment, deleteComment } from '../actions';

const Comment = (props) => {

	const { comment, userSigningKeyId} = props;
	const { updateComment, deleteComment } = props;

	const { content, metadata, signingKeyId } = comment.attrs;

	const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));
	const [prevEditorState, setPrevEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

	const editor = useRef(null);

	const stopPropagation = (e) => e.stopPropagation();

	const toggleEdit = () => {
		if (!isEditing) {
			editor.current.focus();
		} else {
			setEditorState(prevEditorState);
		}
		setIsEditing(!isEditing);
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

	const handleUpdateClick = () => {
		const contentState = editorState.getCurrentContent(); 
        updateComment(
            comment,
            convertToRaw(contentState)
        );
		setIsEditing(false);
		setIsEmojiPickerVisible(false);
		setPrevEditorState(editorState);
	}

	const toggleDelete = () => {
		setIsDeleting(!isDeleting);
	}

	const handleDelete = () => {
		deleteComment(comment);
	}


	return (
		<CommentWrapper>
			<div className = "content">
				<Link to = {`/${metadata ? metadata.commentAuthor: null}`} className = "author" onClick = {stopPropagation}>
					{metadata ? `@${metadata.commentAuthor}` : null}
				</Link>
				<Editor
					ref = {editor}
					editorState = {editorState}
					onChange = {editorState => setEditorState(editorState)}
					readOnly = {!isEditing}
				/>
				{
					isEditing ?
					<div className = "edit-options">
						<div>
							<Button onClick = {toggleEdit} text = "Cancel"/>
						</div>
						<div>
							<Button onClick = {toggleEmojiPicker} bgColor = "grey" text = "Emoji"/>
							<Button onClick = {handleUpdateClick} text = "Update"/>
							{ isEmojiPickerVisible ? 
								<EmojiPicker onEmojiClick={handleEmojiClick}/>
								:
								null
							}
						</div>
					</div>
					:
					null
				}
				{
					isDeleting ?
					<div className = "edit-options">
						<div>
							<Button onClick = {toggleDelete} text = "Cancel"/>
						</div>
						<div>
							<Button onClick = {handleDelete} text = "Delete"/>
						</div>
					</div>
					:
					null
				}
			</div>
			{
				signingKeyId === userSigningKeyId ?
				<div className = "icons">
					<Edit2 size = '15' onClick = {toggleEdit}/>
					<XSquare size = '15' onClick = {toggleDelete}/>
				</div>
				:
				null
			}
			
		</CommentWrapper>
	)
}

const mstp = (state) => {
	return {
		userSigningKeyId: state.auth.anylistUser.attrs.signingKeyId
	}
}

export default connect(mstp, {updateComment, deleteComment})(Comment);

const CommentWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	margin: 15px 0;

	.author {
		font-size: 13px;
	}

	.content {
		width: fill-available;
	}

	.DraftEditor-root {
		padding-left: 10px;
		margin: 10px 0;
	}

	.icons {
		min-width: max-content;
		svg {
			color: grey;
			margin-left: 5px;
			&:hover {
				cursor: pointer;
				color: black;
			}
		}
	}

	.edit-options {
		display: flex;
		justify-content: space-between;
		position: relative;

		.emoji-picker {
			position: absolute;
			top: 100%;
			z-index: 100;
		}
	}

`;