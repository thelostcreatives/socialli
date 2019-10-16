import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Edit2, XSquare } from 'react-feather';
import { Editor, EditorState, Modifier, convertToRaw, convertFromRaw } from 'draft-js';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

const Comment = (props) => {

	const { comment, userSigningKeyId} = props;

	const { content, metadata, signingKeyId } = comment.attrs;

	console.log(content, metadata)

	const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));
	const [isEditing, setIsEditing] = useState(false);

	const editor = useRef(null);

	const stopPropagation = (e) => e.stopPropagation();

	const toggleEdit = () => {
		if (isEditing) {
			editor.current.focus();
		}
		setIsEditing(!isEditing);
	}

	return (
		<CommentWrapper>
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
			{
				signingKeyId === userSigningKeyId ?
				<div className = "icons">
					<Edit2 size = '15' onClick = {toggleEdit}/>
					<XSquare size = '15'/>
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

export default connect(mstp, {})(Comment);

const CommentWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	margin: 15px 0;

	.author {
		font-size: 13px;
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

`;