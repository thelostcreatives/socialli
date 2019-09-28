import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getPosts } from '../actions';
import { PostComp } from './index';

const Explore = (props) => {

    useEffect(() => {
        props.getPosts(props.posts.length, 1)
    }, [])

    return (
        <div>
            {
                props.posts.map(post => {
                    return <PostComp key = {post._id} post={post} preview = {true}/>;
                })
            }
            <button onClick = {() => props.getPosts(props.posts.length, 5)}>load more</button>
        </div>
    )
}

const mstp = (state) => {
    return {
        posts: state.posts.listPosts,
        followedLists: state.auth.anylistUser.attrs.followedLists
    }
}

export default connect(mstp, {getPosts})(Explore);
