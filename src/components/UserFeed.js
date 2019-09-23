import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getPosts } from '../actions';
import { PostComp } from './index';

const UserFeed = (props) => {

    useEffect(() => {
        props.getPosts(props.posts.length, 1)
    }, [])

    return (
        <div>
            {
                props.posts.map(post => {
                    return <PostComp key = {post._id} post={post} />;
                })
            }
            <button onClick = {() => props.getPosts(props.posts.length, 5)}>load more</button>
        </div>
    )
}

const mstp = (state) => {
    return {
        posts: state.posts.feedPosts
    }
}

export default connect(mstp, {getPosts})(UserFeed);
