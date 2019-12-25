import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { getPosts, setSearchString, searchPosts } from '../actions';
import { PostComp, SearchBar } from './index';

const Explore = (props) => {

    const { posts, searchString, searchResults, hasMore } = props;

    const { getPosts, setSearchString, searchPosts } = props;
    
    useEffect(() => {
        if (posts.length === 0) {
            getPosts(posts.length);
        }
    }, []);

    const loadMore = () => {
        if (searchString.length > 0) { 
            searchPosts(searchString, searchResults.length);
        } else { 
            getPosts(posts.length);
        }
    }

    return (
        <InfiniteScroll
            pageStart = {0}
            loadMore = {loadMore}
            hasMore = {hasMore}
            loader = {<div className="loader" key={0}>Loading ...</div>}
        >

            <SearchBar placeholder = "Search #tags and @mentions" value = {searchString} onChange = {e => setSearchString(e.target.value)} onSubmit = {searchPosts}/>

            {
                searchString.length > 0 ?
                searchResults.map(post => {
                    return <PostComp key = {post._id} post={post} preview = {true}/>;
                })
                :
                posts.map(post => {
                    return <PostComp key = {post._id} post={post} preview = {true}/>;
                })
            }
        </InfiniteScroll>
    )
}

const mstp = (state) => {
    return {
        posts: state.posts.listPosts,
        searchString: state.posts.searchString,
        searchResults: state.posts.searchResults,
        followedLists: state.auth.anylistUser.attrs.followedLists,
        hasMore: state.posts.hasMore,
    }
}

export default connect(mstp, {getPosts, setSearchString, searchPosts})(Explore);
