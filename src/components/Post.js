import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const Post = (props) => {
    const { preview, post } = props;

    const { listId, metadata, content } = post.attrs;
    

    return (
        <PostWrapper preview = {preview ? preview : true}>
            <div id = "preview-overlay"/>
            <div id = "post-header">
                <Link to = {`/list/${listId}`}>
                    <h4 className = "list-title">
                        {metadata ? metadata.listTitle : listId}
                    </h4>
                    
                </Link>
                <Link to = {`/${metadata ? metadata.listAuthor : null}`} className = "author">
                    {metadata ? `@${metadata.listAuthor}` : null}
                </Link>
            </div>
            
            <div id = "icons-container">
                {
                    content? "icons here" : null
                }
            </div>
            <div id = "content">
                {content}
            </div>
        </PostWrapper>
    )
}

export default Post;

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 500px;
    padding: 10px;

    border: 1px solid #707070;
    border-bottom: none;

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


    ${props => props.preview && css`
        max-height: 150px;
        overflow: hidden;
        #preview-overlay {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            &:hover {
                cursor: pointer;
                background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,212,255,0) 100%);
            }
            width: 100%;
            height: 100%;

        }
    `}
`;
