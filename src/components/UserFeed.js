import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { getFeedPosts } from '../actions';
import { PostComp } from './index';

const UserFeed = (props) => {

    const { getFeedPosts, followedLists, posts, hasMore } = props;

    useEffect(() => {
        if (posts.length === 0) {
            getFeedPosts(followedLists, posts.length, 20);
        }
    }, [followedLists]);

    const loadMore = () => {
        getFeedPosts(followedLists, posts.length, 5)
    }

    return (
        <InfiniteScroll
            pageStart = {0}
            loadMore = {loadMore}
            hasMore = {hasMore}
            loader = {<div className="loader" key={0}>Loading ...</div>}
        >
            {
                followedLists.length > 0 ? posts.map(post => {
                    return <PostComp key = {post._id} post={post} preview = {true} />;
                })
                :
                <div>
                    <h2 style = {{width: "500px"}}>
                        You are not following any Lists. Try going to the Explore page see if you find something interesting.
                    </h2>
                    <br/>
                    <a href = "https://socialli.st/post/dcc3bf6abc4c-461d-981a-1b86f3dc6cc5">
                        quick tutorial
                    </a>
                </div>
            }
        </InfiniteScroll>
    )
}

const mstp = (state) => {
    return {
        posts: state.posts.feedPosts,
        followedLists: state.auth.anylistUser.attrs.followedLists,
        hasMore: state.posts.feedHasMore
    }
}

export default connect(mstp, {getFeedPosts})(UserFeed);
