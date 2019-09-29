import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList, followList, unfollowList, getPosts } from '../actions';
import { List } from '../models';
import PostComp from './Post';

const ListPage = (props) => {

	const { listPosts } = props;

	const posts = listPosts[props.match.params.id] ? listPosts[props.match.params.id] : [];

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${props.match.params.id}`);
			return data;
		}
		getListData().then(data => {
			props.setActiveList(data);
		});
	}, [])

	useEffect (() => {
		if (posts.length === 0) {
			props.getPosts(posts.length, 5, props.match.params.id);
		}
	}, [])

	return (
		<ListPageWrapper>
			<h1>{props.listData ? props.listData.attrs.title : null}</h1>
            {
				props.listData.attrs.signingKeyId !== props.anylistUser.attrs.signingKeyId  && !props.followedLists.includes(props.match.params.id) ? <button onClick = {() => props.followList(props.anylistUser, props.match.params.id)}>Follow</button> 
				:
				props.followedLists.includes(props.match.params.id) ? <button onClick = {() => props.unfollowList(props.anylistUser, props.match.params.id)}>Unfollow</button>
				: null
            }
			<p>{props.listData? props.listData.attrs.description : null}</p>
			<div>
				{
					posts.map(post => {
                        return <PostComp key = {post._id} preview = {true} post = {post} />
					})
				}
			</div>
		</ListPageWrapper>
	)
}

const mstp = (state) => {
	return {
        listData: state.lists.activeList,
        anylistUser: state.auth.anylistUser,
		followedLists: state.auth.anylistUser.attrs.followedLists,
		listPosts: state.posts.lists
	}
}

export default connect(mstp, {setActiveList, followList, unfollowList, getPosts})(ListPage);

const ListPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    
`;


