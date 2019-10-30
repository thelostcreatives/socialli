import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Link2, Edit, XSquare } from 'react-feather';
import ClipBoard from 'clipboard';
import moment from 'moment';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

import { Button, ConfirmationOverlay, Comments } from './index';
import { setExpandedPost, updatePost, deletePost, unfollowPost } from '../actions';
import { Post as PostModel} from '../models';

const Post = (props) => {

    const { anylistUser, preview, post, match, history, expandedPost, setExpandedPost, updatePost, deletePost, unfollowPost, userSigningKeyId } = props;
    
    const { listId, metadata, content, signingKeyId, createdAt } = post ? post.attrs: expandedPost.attrs;

    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    new ClipBoard('.postLink');

    useEffect (() => {
        if (!preview) {
            if (!expandedPost.attrs._id || expandedPost.attrs._id !== match.params.id ) {
                PostModel.findById(match.params.id).then(post => {
                    setExpandedPost(post)
                })
            } else {
                setEditorState(EditorState.createWithContent(convertFromRaw(expandedPost.attrs.content)))
            }
        }
    }, [expandedPost])

    const handlePreviewClick = () => {
        if (window.getSelection().toString().length === 0) {
            props.setExpandedPost(post);
            history.push(`/post/${post._id}`);
        }
    }

    const handleUpdateClick = () => {
        const contentState = editorState.getCurrentContent(); 
        updatePost(
            expandedPost,
            convertToRaw(contentState)
        );
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
        history.goBack();
    }

    const editor = useRef(null);

	const focusEditor = () => {
		editor.current.focus();
	}

    const stopPropagation = (e) => e.stopPropagation();

    return (
        <PostWrapper preview = {preview} onClick = {preview ? handlePreviewClick : null}>
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
                            <Link to = {`/list/${listId}`} onClick = {stopPropagation}>
                                <h4 className = "list-title">
                                    {metadata ? metadata.listTitle : listId}
                                </h4>
                            </Link>
                            <Link to = {`/${metadata ? metadata.listAuthor : null}`} className = "author" onClick = {stopPropagation}>
                                {metadata ? `@${metadata.listAuthor}` : null}
                            </Link>
                        </div>
                        <time>
                            {moment(createdAt).fromNow()}
                        </time>
                    </div>
                    <Editor
                        ref = {editor}
                        editorState = {editorState}
                        onChange = {editorState => setEditorState(editorState)}
                        readOnly = {!isEditing}

                    />
                    {preview ? null :
                        <>
                            <div id = "icons-container">
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
                                            <Button onClick = { () => {
                                                setIsEditing(true);
                                                focusEditor();
                                            }} text = "Edit" />
                                            :
                                            <div className = "edit-options">
                                                <Button onClick = {handleUpdateClick} text = "Update"/>
                                                <XSquare onClick = {handleDeleteClick} className = "delete"/>
                                            </div>
                                        }
                                    </div>
                                    :
                                    null
                                }
                            </div>

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
        expandedPost: state.posts.expandedPost
    }
}

export default withRouter(
    connect(mstp, {setExpandedPost, updatePost, deletePost, unfollowPost})(Post)
);

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 500px;
    padding: 10px;

    border: none;

    font-size: 16px;
    font-family: 'Work Sans', sans-serif;

    #options-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .edit-options {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    #icons-container {
        border-top: 1px solid #d2d6d7;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        align-self: center;
        margin-top: 10px;
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

            .list-title {
                margin: 10px 0;
                margin-bottom: 5px;
            }
            .author {
                font-size: 13px;
                margin-left: 10px;
            }
        }

        time {
            font-size: 12px;
        }
    }

    .postLink {
        color: grey;
        &:hover {
            color: black;
            cursor: pointer;
        }
    }

    .DraftEditor-root {
		margin: 10px 0;
	}

    .delete {
        color: #e86813;
        &:hover {
            cursor: pointer;
            color: #e81313;
        }
    }

    ${props => props.preview === true && css`
        max-height: 150px;
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
    `}


    @media only screen and (max-width: 480px) {
        width: unset;
    }
`;
