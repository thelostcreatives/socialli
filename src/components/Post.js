import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { connect } from 'react-redux';

import { setExpandedPost } from '../actions';

const Post = (props) => {
    const { preview, post, history, expandedPost } = props;

    const { listId, metadata, content } = post ? post.attrs: expandedPost.attrs;

    const [editorState] = useState(EditorState.createWithContent(convertFromRaw(content)));

    // const editorContent = editorState.createWithContent(content);
    const handlePreviewClick = () => {
        if (window.getSelection().toString().length === 0) {
            props.setExpandedPost(post);
            history.push(`/post/${post._id}`);
        }
    }

    const stopPropagation = (e) => e.stopPropagation();

    return (
        <PostWrapper preview = {preview} onClick = {preview ? handlePreviewClick : null}>
            {/* <div id = "preview-overlay" onClick = {handlePreviewClick}/> */}
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
            
            <div id = "icons-container">
                {
                    content? "icons here" : null
                }
            </div>
            {
                typeof(content) === 'string' ? 
                <div id = "content">
                    {content}
                </div> 
                :
                <div >
                    <Editor
                        editorState = {editorState}
                        readOnly = {true}
                    />
                </div>
                
            }
            
        </PostWrapper>
    )
}

const mstp = (state) => {
    return {
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
        align-self: flex-end;
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

    #post-overlay {
        display: none;
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
