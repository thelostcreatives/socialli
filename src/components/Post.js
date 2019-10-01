import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Link2, Edit, XSquare } from 'react-feather';
import ClipBoard from 'clipboard';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

import { Button } from './index';
import { setExpandedPost, updatePost } from '../actions';
import { Post as PostModel} from '../models';

const Post = (props) => {

    const { preview, post, match, history, expandedPost, setExpandedPost, updatePost, userSigningKeyId } = props;
    
    const { listId, metadata, content, signingKeyId } = post ? post.attrs: expandedPost.attrs;

    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));
    const [isEditing, setIsEditing] = useState(false);

    new ClipBoard('.postLink');

    useEffect (() => {
        if (!preview) {
            if (!expandedPost.attrs._id) {
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

    const editor = useRef(null);

	const focusEditor = () => {
		editor.current.focus();
	}

    const stopPropagation = (e) => e.stopPropagation();

    return (
        <PostWrapper preview = {preview} onClick = {preview ? handlePreviewClick : null}>
            <div id = "post-header">
                <Link to = {`/list/${listId}`} onClick = {stopPropagation}>
                    <h4 className = "list-title">
                        {metadata ? metadata.listTitle : listId}
                    </h4>
                </Link>
                <Link to = {`/${metadata ? metadata.listAuthor : null}`} className = "author" onClick = {stopPropagation}>
                    {metadata ? `@${metadata.listAuthor}` : null}
                </Link>
            </div>
            
            <Editor
                ref = {editor}
                editorState = {editorState}
                onChange = {editorState => setEditorState(editorState)}
                readOnly = {!isEditing}
            />

            {preview ? null :
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
                                <Button onClick = {handleUpdateClick} text = "Update"/>
                            }
                        </div>
                        :
                        null
                    }
                </div>
            }
            
        </PostWrapper>
    )
}

const mstp = (state) => {
    return {
        userSigningKeyId: state.auth.anylistUser.attrs.signingKeyId, 
        expandedPost: state.posts.expandedPost
    }
}

export default withRouter(
    connect(mstp, {setExpandedPost, updatePost})(Post)
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
        align-items: center;
        width: 100%;
        
        .list-title {
            margin: 10px 0;
        }
        .author {
            font-size: 13px;
            margin-left: 10px;
        }
    }

    .postLink {
        color: grey;
        &:hover {
            color: black;
            cursor: pointer;
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
`;
