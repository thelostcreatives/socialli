import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';

import { setActiveList, followList, unfollowList, getPosts } from '../actions';
import { List } from '../models';
import PostComp from './Post';

const ListPage = (props) => {

	const { hasMore, listPosts, getPosts, setActiveList, followList, unfollowList, match, listData, anylistUser, followedLists} = props;

	const posts = listPosts[match.params.id] ? listPosts[match.params.id] : [];

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${match.params.id}`);
			return data;
		}
		getListData().then(data => {
			setActiveList(data);
		});
	}, [])

	useEffect (() => {
		if (posts.length === 0) {
			getPosts(posts.length, 5, match.params.id);
		}
	}, [])

	const loadMore = () => {
		getPosts(posts.length, 5, match.params.id);
	}

	return (
		<ListPageWrapper>
			<h1>{listData ? listData.attrs.title : null}</h1>
            {
				listData.attrs.signingKeyId !== anylistUser.attrs.signingKeyId  && !followedLists.includes(match.params.id) ? <button onClick = {() => followList(anylistUser, match.params.id)}>Follow</button> 
				:
				followedLists.includes(match.params.id) ? <button onClick = {() => unfollowList(anylistUser, match.params.id)}>Unfollow</button>
				: null
            }
			<p>{listData? listData.attrs.description : null}</p>
			<InfiniteScroll
				pageStart = {0}
				loadMore = {loadMore}
				hasMore = {hasMore}
				loader = {<div className="loader" key={0}>Loading ...</div>}
			>
				{
					posts.map(post => {
                        return <PostComp key = {post._id} preview = {true} post = {post} />
					})
				}
			</InfiniteScroll>
		</ListPageWrapper>
	)
}

const mstp = (state) => {
	return {
        listData: state.lists.activeList,
        anylistUser: state.auth.anylistUser,
		followedLists: state.auth.anylistUser.attrs.followedLists ? state.auth.anylistUser.attrs.followedLists : [],
		listPosts: state.posts.lists,
		hasMore: state.posts.listHasMore
	}
}

export default connect(mstp, {setActiveList, followList, unfollowList, getPosts})(ListPage);

const ListPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    
`;


