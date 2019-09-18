import React from 'react';
import styled from 'styled-components';

const Post = (props) => {
    return (
        <PostWrapper>
            {/*<div id = "options-bar">
                <div>
                    <h1>
                        List Title
                    </h1>
                </div>
                
            </div>
            */}
            <div id = "icons-container">
                icons here
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

    margin: 0 0 10px;
    padding: 5px;

    border: 1px solid black;

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
