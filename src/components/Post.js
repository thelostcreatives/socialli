import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw, convertToRaw, Modifier, ContentState } from 'draft-js';
import { connect } from 'react-redux';
import { Link2, Edit, XSquare, ChevronRight } from 'react-feather';
import ClipBoard from 'clipboard';
import moment from 'moment';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';
import { Picker as EmojiPicker } from 'emoji-mart';

import { Button, ConfirmationOverlay, Comments, OptionsBar, ImageCarousel } from './index';
import { setExpandedPost, getUserData, updatePost, deletePost, unfollowPost, getListData, updateNotif, deleteNotif } from '../actions';
import { Post as PostModel} from '../models';
import { breakpoint } from '../utils/styleConsts';
import { AVATAR_FALLBACK_IMG, POST_PREVIEW_LIMIT } from '../utils/constants';
import { removeExtraNewLines, getCompositeDecorator, HANDLE_REGEX, HASHTAG_REGEX, getMatchesFromString } from '../utils/helpers';

const Post = (props) => {

    const { anylistUser, preview, post, 
            match, history, expandedPost, 
            userSigningKeyId, users, lists } = props;

    const { setExpandedPost, updatePost, deletePost, 
            unfollowPost, getUserData, getListData, updateNotif, deleteNotif } = props;
    
    const { listId, metadata, content, signingKeyId, createdAt, other = {} } = post ? post.attrs: expandedPost.attrs;

    const postDecorator = getCompositeDecorator('post');
    const editorDecorator = getCompositeDecorator('editor');

    const newEditorState = EditorState.createWithContent(convertFromRaw(content), postDecorator);

    const [editorState, setEditorState] = useState(newEditorState);
    const [plainTextContent, setPlainTextContent] = useState(newEditorState.getCurrentContent().getPlainText());
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    new ClipBoard('.postLink');

    useEffect (() => {
        if (!preview) {
            if (!expandedPost.attrs._id || expandedPost.attrs._id !== match.params.id ) {
                PostModel.findById(match.params.id).then(post => {
                    setExpandedPost(post)
                })
            } else {
                const newEditorState = EditorState.createWithContent(convertFromRaw(expandedPost.attrs.content), postDecorator);
                setEditorState(newEditorState);
                setPlainTextContent(newEditorState.getCurrentContent().getPlainText());
            }
        }
    }, [expandedPost]);

    useEffect (() => {
        if (!users[signingKeyId] && metadata) {
            getUserData(metadata.author ? metadata.author : metadata.listAuthor);
        }
    }, [expandedPost]);

    useEffect (() => {
        if (!lists[listId]) {
            getListData(listId);
        }
    }, [lists]);

    useEffect (() => {
        if (isEditing) { 
            setEditorState(EditorState.set(editorState, {decorator: editorDecorator}))
        }
    }, [isEditing])

    const handlePreviewClick = () => {
        if (window.getSelection().toString().length === 0) {
            props.setExpandedPost(post);
            history.push(`/post/${post._id}`);
        }
    }

    const toggleEmojiPicker = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    }

    const handleUpdateClick = () => {
        const contentState = editorState.getCurrentContent(); 
        const cleanText = removeExtraNewLines(contentState.getPlainText());
        const cleanContentState = ContentState.createFromText(cleanText);

        const mentions = getMatchesFromString(HANDLE_REGEX, cleanText).map(mention => mention.substr(1));
        const hashtags = getMatchesFromString(HASHTAG_REGEX, cleanText).map(hashtag => hashtag.substr(1));

        setEditorState(EditorState.set(EditorState.createWithContent(cleanContentState), {decorator: postDecorator}));

        updatePost(
            expandedPost,
            convertToRaw(cleanContentState),
            mentions,
            hashtags
        );

        updateNotif(expandedPost._id, {mentions});
        
        setIsEditing(false);
    }

    const handleDeleteClick = () => {
        
        setIsDeleting(true);
    }

    const handleCancel = () => {
        setIsDeleting(false);
    }

    const handleDelete = () => {
        deletePost(expandedPost);
        unfollowPost(anylistUser, expandedPost._id);
        deleteNotif(expandedPost._id);
        history.push(`/list/${listId}`);
    }

    const handleEmojiClick = (emoji) => {
		const selection = editorState.getSelection();
		const contentState = editorState.getCurrentContent();
		const newState =  Modifier.insertText(contentState, selection, emoji.native);
		const state = EditorState.push(editorState, newState, "insert-characters");
		setEditorState(state);
    }
    
    const handleEditClick = () => {
        setIsEditing(true);
        focusEditor();
    }

    const editor = useRef(null);

	const focusEditor = () => {
		editor.current.focus();
	}

    const stopPropagation = (e) => e.stopPropagation();

    const handleEditorChange = (editorState) => { 
        setEditorState(editorState);
    }

    return (
        <PostWrapper preview = {preview} hasImg = {other.images} onClick = {preview ? handlePreviewClick : null}>
            {
                isDeleting ? 
                <ConfirmationOverlay 
                    message = "Delete Post?" 
                    details = "This will delete your post and cannot be recovered."
                    confirm = {handleDelete} 
                    cancel = {handleCancel}
                />
                :
                <>
                    <div id = "post-header">
                        <div className = "metadata">
                            <div className = "author-img">
                                <img src = {users[signingKeyId] ? users[signingKeyId].attrs.other.avatarUrl || AVATAR_FALLBACK_IMG : AVATAR_FALLBACK_IMG} alt = "avatar"/>
                            </div>
                            <div>
                                <Link to = {`/${metadata ? metadata.listAuthor : null}`} onClick = {stopPropagation}>
                                    {metadata ? metadata.listAuthor : null}
                                </Link>

                                <ChevronRight size = {15}/>

                                <Link to = {`/list/${listId}`} onClick = {stopPropagation}>
                                        {lists[listId] ? lists[listId].attrs.title : `...`}
                                </Link>
                                <div>
                                    <time>
                                        {moment(createdAt).fromNow()}
                                    </time>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    {
                        other.images ? 
                        <ImageCarousel imgs = {other.images}/>
                        :
                        null
                    }
                    
                    {
                        preview ? 
                        <p>
                            { 
                                plainTextContent.length <= POST_PREVIEW_LIMIT ? 
                                <pre>
                                    {plainTextContent}
                                </pre>
                                :
                                <pre>
                                    {`${plainTextContent.substr(0, POST_PREVIEW_LIMIT)}`}
                                    <span id = "more-content-indicator"> ...more</span>
                                </pre>
                            }
                        </p>
                        :
                        <Editor
                            ref = {editor}
                            editorState = {editorState}
                            onChange = {handleEditorChange}
                            readOnly = {!isEditing}
                        />
                    }
                    
                    {preview ? null :
                        <>
                            <OptionsBar className = "icons-container">
                                <Tippy content = "copied link" trigger = "click">
                                    <div>
                                        <Link2 className = "postLink" title = "copy link" data-clipboard-text = {`${window.location.href}`}/>
                                    </div>
                                </Tippy>
                                {
                                    userSigningKeyId === signingKeyId ? 
                                    <div>
                                        {
                                            !isEditing ?
                                            <Button onClick = { handleEditClick } text = "Edit" />
                                            :
                                            <>
                                                <Button onClick = {toggleEmojiPicker} bgColor = "grey" text = "Emoji"/>
                                                <Button onClick = {handleUpdateClick} text = "Update"/>
                                                <XSquare onClick = {handleDeleteClick} className = "delete" style = {{margin: "5px"}}/>
                                                { isEmojiPickerVisible ?
                                                    <EmojiPicker 
                                                        set = "emojione"
                                                        onSelect = {handleEmojiClick}
                                                    />
                                                    :
                                                    null
                                                }
                                            </>
                                        }
                                    </div>
                                    :
                                    null
                                }
                            </OptionsBar>

                            <Comments post = {expandedPost}/>
                        </>
                    }
                </>
            }
        </PostWrapper>
    )
}

const mstp = (state) => {
    return {
        anylistUser: state.auth.anylistUser,
        userSigningKeyId: state.auth.anylistUser.attrs.signingKeyId, 
        expandedPost: state.posts.expandedPost,
        users: state.auth.users,
        lists: state.lists.allLists
    }
}

export default withRouter(
    connect(mstp, {setExpandedPost, getUserData, updatePost, deletePost, unfollowPost, getListData, deleteNotif, updateNotif})(Post)
);

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 500px;
    max-width: 500px;
    padding: 10px;

    border: none;

    font-size: 16px;
    font-family: 'Work Sans', sans-serif;

    #options-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #more-content-indicator {
        margin-top: 10px;
        color: grey;
    }

    .edit-options {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .icons-container {
        border-bottom: 1px solid #d2d6d7;
    }

    #content {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.38;
    }

    #post-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .metadata {
            display: flex;
            align-items: center;

            position: relative;

            margin-bottom: 10px;

            .author-img {
                display: flex;
                align-items: center;
                
                min-width: 40px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                
                margin-right: 10px;

                img {
                    width: 100%;
                }
            }

            a {
                font-size: 14px;
                font-weight: bold;
                text-decoration: none;

                &:hover {
                    text-decoration: underline
                }
            }

            svg {
                position: relative;
                bottom: -3px;
            }
        }

        time {
            font-size: 12px;
        }
    }

    .delete {
        color: #e86813;
        &:hover {
            cursor: pointer;
            color: #e81313;
        }
    }

    @media only screen and (max-width: ${breakpoint.a}) {
        width: unset;
        #post-header {
            .metadata {
                flex-direction: column;
                align-items: flex-start;
                
                .author {
                    margin: 0;
                }
            }
        }

        margin: 0;
    }


    @media only screen and (max-width: ${breakpoint.b}) {
        // width: 90vh;
    }

    ${props => props.preview === true && css`
        overflow: hidden;
        margin: 20px 0;
        #preview-overlay {
            display: block;
            position: absolute;
            z-index: 11;
            top: 0;
            left: 0;
            &:hover {
                cursor: pointer;
                background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,212,255,0) 100%);
            }
            width: 100%;
            height: 100%;

        }

        &:hover {
            cursor: pointer;
            background: #f7f7f7;
        }

        @media only screen and (max-width: ${breakpoint.a}) {
            // height: 150px;
        }
    `}
`;
