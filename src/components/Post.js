import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Post = (props) => {
    return (
        <PostWrapper>
            <div id = "options-bar">
                <div>
                    <Link to = {`/list/${props.post.attrs.listId}`}>
                        <h1>
                            List Title
                        </h1>
                    </Link>
                </div>
                
            </div>
            
            <div id = "icons-container">
                {
                    props.post.attrs.content? "icons here" : null
                }
            </div>
            <div id = "content">
                {props.post.attrs.content}
            </div>
        </PostWrapper>
    )
}

export default Post;

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;

    padding: 10px;

    border: 1px solid #707070;
    border-bottom: none;
    // border-radius: 10px;

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
`;
