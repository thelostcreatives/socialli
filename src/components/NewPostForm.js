import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState, Modifier, convertToRaw } from 'draft-js';
import styled from 'styled-components';
import { Picker as EmojiPicker } from 'emoji-mart';
import { Image } from 'react-feather';

import { Button, ImageCarousel } from './index';
import { createPost, setActiveList, followPost, uploadImages, createNotif } from '../actions';
import { List } from '../models';
import { breakpoint } from '../utils/styleConsts';
import { isImageFileSizeAcceptable, areAllImageFileSizesAcceptable, compressImage, 
		 removeExtraNewLines, getCompositeDecorator, HANDLE_REGEX, HASHTAG_REGEX, getMatchesFromString } from '../utils/helpers';
import { SUPPORTED_IMAGE_FORMATS, NOTIF_TYPES } from '../utils/constants';

const NewPostForm = (props) => {
	const { 
		anylistUser, userSession, listData,
		match, done
	} = props;

	const {
		createPost, setActiveList, followPost,
		uploadImages, createNotif
	} = props;

	const { author: listAuthor, title, _id: listId } = listData;
	const { username } = anylistUser.attrs;

	const [images, setImages] = useState();
	const [tempImgUrls, setTempImgUrls] = useState();

	const [creatingPost, setCreatingPost] = useState(false);

	const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

	const [editorState, setEditorState] = useState(EditorState.createEmpty(getCompositeDecorator('editor')));

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
		const cleanText = removeExtraNewLines(contentState.getPlainText());

		const cleanContentState = ContentState.createFromText(cleanText);

		if (contentState.hasText()) {
			setCreatingPost(true);
			let imageGaiaLinks = images;
			const mentions = getMatchesFromString(HANDLE_REGEX, cleanText).map(mention => mention.substr(1));
			const hashtags = getMatchesFromString(HASHTAG_REGEX, cleanText).map(hashtag => hashtag.substr(1));

			if ( images ) {
				imageGaiaLinks = await uploadImages(userSession, anylistUser, images);
			}

			const newPost = await createPost(
				listData._id,
				{
					listAuthor,
					listTitle: title,
					author: username
				},
				convertToRaw(cleanContentState),
				mentions,
				hashtags,
				imageGaiaLinks
			);
			done();
			followPost(anylistUser, newPost._id);


			createNotif(username, listId, newPost._id, NOTIF_TYPES.post, { 
				...newPost.attrs.metadata
			}, mentions);
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

	const handleImageInputChange = async (e) => {
		const files = [...e.target.files].filter( file => {
			const fileNameSplit = file.name.split(".");
			const fileFormat = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
			return SUPPORTED_IMAGE_FORMATS.includes(fileFormat);
		});

		const appendImageToImages = (image) => {
			setImages(images => {
				if (!images) {
					return [image];
				} else {
					return  [...images, image];
				}
			});
		}

		const tempUrls = files.map( file => window.URL.createObjectURL(file) );
		setTempImgUrls(tempUrls.length > 0 ? tempUrls : null);

		if (areAllImageFileSizesAcceptable(files)) {
			setImages(files.length > 0 ? files : null);
		} else {
			files.forEach( (image) => {
				const nameSplit = image.name.split('.');
				const fileType = nameSplit[nameSplit.length - 1];
				if(isImageFileSizeAcceptable(image.size) || fileType === 'gif') {
					appendImageToImages(image);
				} else {
					compressImage(image, (compressed) => {
						appendImageToImages(compressed);
					});
				}
			});
		}
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

			<input type = "file" id = "image-input" accept = "image/*" hidden = 'hidden' onChange = {handleImageInputChange} multiple/>

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

export default connect(mstp, {createPost, setActiveList, followPost, uploadImages, createNotif})(NewPostForm);

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

	@media only screen and (max-width: ${breakpoint.b}) {
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