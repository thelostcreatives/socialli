import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, Modifier, convertToRaw } from 'draft-js';
import styled from 'styled-components';
import { Picker as EmojiPicker } from 'emoji-mart';
import { Image } from 'react-feather';

import { Button, ImageCarousel } from './index';
import { createPost, setActiveList, followPost, uploadImages } from '../actions';
import { List } from '../models';
import { breakpoint } from '../utils/styleConsts';
import { readUrl } from '../utils/helpers';
import { SUPPORTED_IMAGE_FORMATS } from '../utils/constants';

const NewPostForm = (props) => {
	const { 
		anylistUser, userSession, listData,
		match, done
	} = props;

	const {
		createPost, setActiveList, followPost,
		uploadImages
	} = props;

	const { author, title } = listData;

	const [images, setImages] = useState();
	const [tempImgUrls, setTempImgUrls] = useState();

	const [creatingPost, setCreatingPost] = useState(false);

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

	useEffect(() => {
		return () => {
			if ( tempImgUrls ) {
				tempImgUrls.forEach( url => window.URL.revokeObjectURL(url) );
			}
		}
	},[tempImgUrls]);

	const handlePost = async () => {
		const contentState = editorState.getCurrentContent(); 
		if (contentState.hasText()) {
			setCreatingPost(true);
			const imageGaiaLinks = await uploadImages(userSession, anylistUser, images);
			const newPost = await createPost(
				listData._id,
				{
					listAuthor: author,
					listTitle: title
				},
				convertToRaw(contentState),
				imageGaiaLinks
			);
			done();
			followPost(anylistUser, newPost._id);
		} else {
			console.log("Tell us stories meyn");
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

	const handleImageIconClick = () => {
		document.getElementById("image-input").click();
	}

	const handleImageUpload = async (e) => {
		const files = [...e.target.files].filter( file => {
			const fileNameSplit = file.name.split(".");
			const fileFormat = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
			return SUPPORTED_IMAGE_FORMATS.includes(fileFormat);
		});

		setImages(files.length > 0 ? files : null);

		const tempUrls = files.map( file => window.URL.createObjectURL(file) );
		setTempImgUrls(tempUrls.length > 0 ? tempUrls : null);
	}

	return (
		<NewPostFormWrapper onClick = {focusEditor}>
			{
				tempImgUrls ? 
				<ImageCarousel imgs = {tempImgUrls}/>
				:
				null
			}
			<Editor
				ref = {editor}
				editorState = {editorState}
				onChange = {editorState => setEditorState(editorState)}
				placeholder = {"Share your story..."}
			/>

			<input type = "file" id = "image-input" accept = "image/*" hidden = 'hidden' onChange = {handleImageUpload} multiple/>

			<OptionsBar onClick = {e => e.stopPropagation()}>
				<div>
					<Button onClick = {done} text = "Cancel"/>
				</div>
				<div>
					<Image onClick = {handleImageIconClick} className = "image"/>
					<Button onClick = {toggleEmojiPicker} bgColor = "grey" text = "Emoji"/>
					<Button onClick = {handlePost} text = {creatingPost ? "Posting..." : "Post"} disabled = {creatingPost}/>
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
		</NewPostFormWrapper>
	);
}

const mstp = (state) => {
	return {
		anylistUser: state.auth.anylistUser,
		userSession: state.auth.userSession,
		listData: state.lists.activeList.attrs
	}
}

export default connect(mstp, {createPost, setActiveList, followPost, uploadImages})(NewPostForm);

const NewPostFormWrapper = styled.div`
	font-family: 'Work Sans', sans-serif;

	align-self: center;
	
	width: 500px;
    height: fit-content;
	-webkit-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
	-moz-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
	box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);

	padding: 10px;
	margin: 25px 0;
	border-radius: 10px;
	.DraftEditor-root{
		min-height: 100px;
	}

	@media only screen and (max-width: ${breakpoint.b}) {
		width: 90vw;
	}

	@media only screen and (min-width: ${breakpoint.b}) {
		width: 500px;
	}
`;

export const OptionsBar = styled.div`
	display: flex;
	justify-content: space-between;
	position: relative;

	svg {
		margin: 5px;
		color: grey;
        &:hover {
            color: black;
            cursor: pointer;
        }
	}

	& > div {
		display: flex;
	}

	margin: 5px 0;

	.emoji-mart {
		position: absolute;
		top: 100%;
		z-index: 100;

		height: 500px;
		overflow-y: scroll;

		padding: 10px;
		margin-bottom: 10px;

		background: white;
		border: none;

		font-family: 'Work Sans', sans-serif;

		label, .emoji-mart-bar, .emoji-mart-search-icon {
			display: none;
		}

		button {
			display: inline-block;
			background: none;
			border: none;
			margin-right: 1px;
		}

		ul {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
		}
		
		.emoji-mart-search > input {
			width: fill-available;
			outline: none;
			margin: 10px 0;

			padding: 1px;

			border: none;
			border-bottom: 2px solid black;
		}
	}

	.skin-tones {
		display: none;
	}

	@media only screen and (max-width: ${breakpoint.a}) {
		.emoji-mart {
			left: 0;
			width: 80vw !important;
		}
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