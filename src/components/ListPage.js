import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';

import { Button } from './index';
import { Header } from './Profile';
import { setActiveList, followList, unfollowList, getPosts } from '../actions';
import { List } from '../models';
import PostComp from './Post';

const ListPage = (props) => {

	const { hasMore, listPosts, getPosts, setActiveList, followList, unfollowList, match, listData, anylistUser, followedLists, isOwned} = props;

	const posts = listPosts[match.params.id] ? listPosts[match.params.id] : [];

	const { title, author, description } = listData.attrs;

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
			<Header>
				<h1 id = "name">{listData ? title : null}</h1>
				<h2 id = "username">{ author }</h2>
				<p>{listData? description : null}</p>

				<div className = "icons-container">
					{
						isOwned ? 
						<div>
							edit/delete icons here
						</div>
						:
						null
					}
					{
						listData.attrs.signingKeyId !== anylistUser.attrs.signingKeyId  && !followedLists.includes(match.params.id) ? <Button onClick = {() => followList(anylistUser, match.params.id)} text = "Follow"/> 
						:
						followedLists.includes(match.params.id) ? <Button onClick = {() => unfollowList(anylistUser, match.params.id)} text = "Unfollow"/>
						: null
					}
				</div>

			</Header>
			<InfiniteScroll
				pageStart = {0}
				loadMore = {loadMore}
				hasMore = {hasMore}
				loader = {<div className="loader" key={0}>Loading ...</div>}
			>
				{
					posts.map(post => {
                        return <PostComp key = {post._id} preview = {true} post = {post} isOwned = {isOwned}/>
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

	font-family: 'Work Sans', sans-serif;
    
`;


