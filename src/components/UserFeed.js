import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getFeedPosts } from '../actions';
import { PostComp } from './index';

const UserFeed = (props) => {

    useEffect(() => {
        props.getFeedPosts(props.followedLists, props.posts.length, 1)
    }, [])

    return (
        <div>
            {
                props.followedLists.length > 0 ? props.posts.map(post => {
                    return <PostComp key = {post._id} post={post} />;
                }) : null
            }
            <button onClick = {() => props.getFeedPosts(props.followedLists, props.posts.length, 5)}>load more</button>
        </div>
    )
}

const mstp = (state) => {
    return {
        posts: state.posts.feedPosts,
        followedLists: state.auth.anylistUser.attrs.followedLists
    }
}

export default connect(mstp, {getFeedPosts})(UserFeed);
