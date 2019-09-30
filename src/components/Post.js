import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Link2 } from 'react-feather';
import ClipBoard from 'clipboard';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

import { setExpandedPost } from '../actions';
import { Post as PostModel} from '../models';

const Post = (props) => {

    const { preview, post, match, history, expandedPost, setExpandedPost, userSigningKeyId } = props;
    
    const { listId, metadata, content, signingKeyId } = post ? post.attrs: expandedPost.attrs;

    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)));

    new ClipBoard('.postLink');

    console.log(userSigningKeyId === signingKeyId)

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
            
            {
                typeof(content) === 'string' ? 
                <div id = "content">
                    {content}
                </div> 
                :
                <Editor
                    editorState = {editorState}
                    readOnly = {true}
                />
            }
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
                            edit/delete icons here
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
    connect(mstp, {setExpandedPost})(Post)
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
