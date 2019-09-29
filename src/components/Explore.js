import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { getPosts } from '../actions';
import { PostComp } from './index';

const Explore = (props) => {

    const { getPosts, posts, hasMore } = props;

    useEffect(() => {
        if (posts.length === 0) {
            getPosts(props.posts.length, 5)
        }
    }, [])

    const loadMore = () => {
        getPosts(props.posts.length, 5);
    }

    return (
        <InfiniteScroll
            pageStart = {0}
            loadMore = {loadMore}
            hasMore = {hasMore}
            loader = {<div className="loader" key={0}>Loading ...</div>}
        >
            {
                props.posts.map(post => {
                    return <PostComp key = {post._id} post={post} preview = {true}/>;
                })
            }
        </InfiniteScroll>
    )
}

const mstp = (state) => {
    return {
        posts: state.posts.listPosts,
        followedLists: state.auth.anylistUser.attrs.followedLists,
        hasMore: state.posts.hasMore
    }
}

export default connect(mstp, {getPosts})(Explore);
