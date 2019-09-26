import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getFeedPosts } from '../actions';
import { PostComp } from './index';

const UserFeed = (props) => {

    const { getFeedPosts, followedLists, posts } = props;

    useEffect(() => {
        getFeedPosts(followedLists, posts.length, 1);
    }, [followedLists]);

    return (
        <div>
            {
                followedLists.length > 0 ? posts.map(post => {
                    return <PostComp key = {post._id} post={post} />;
                }) : null
            }
            <button onClick = {() => getFeedPosts(followedLists, posts.length, 5)}>load more</button>
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
