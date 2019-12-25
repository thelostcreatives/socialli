import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { debounce } from 'underscore';

import { getPosts, searchPosts } from '../actions';
import { PostComp, SearchBar } from './index';

const Explore = (props) => {

    const { posts, searchResults, hasMore } = props;

    const { getPosts, searchPosts } = props;
    
    const [searchString, setSearchString] = useState("");

    useEffect(() => {
        if (posts.length === 0) {
            getPosts(posts.length);
        }
    }, []);

    const loadMore = () => {
        if (searchString.lenth > 0) { 
            searchPosts(searchString, searchResults.length);
        } else { 
            getPosts(posts.length);
        }
    }

    const debouncedSearch = debounce((value) => { 
        setSearchString(value);
        searchPosts(value, searchResults.length);
    }, 1000);

    const handleSearch = (e) => {
        const value = e.target.value;
        debouncedSearch(value);
    }

    return (
        <InfiniteScroll
            pageStart = {0}
            loadMore = {loadMore}
            hasMore = {hasMore}
            loader = {<div className="loader" key={0}>Loading ...</div>}
        >
            <SearchBar placeholder = "Search #tags and @mentions" onChange = {handleSearch}/>

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
        searchResults: state.posts.searchResults,
        followedLists: state.auth.anylistUser.attrs.followedLists,
        hasMore: state.posts.hasMore
    }
}

export default connect(mstp, {getPosts, searchPosts})(Explore);
