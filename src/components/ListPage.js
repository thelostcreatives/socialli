import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList, followList, unfollowList } from '../actions';
import { List, Post } from '../models';
import PostComp from './Post';

const ListPage = (props) => {

	const [posts, setPosts] = useState([]);

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${props.match.params.id}`);
			return data;
		}
        //if (!props.listData){
			getListData().then(data => {
				props.setActiveList(data);
			});
        //}
	}, [])

	useEffect (() => {
		const getPosts = async () => {
			const data = await Post.fetchList({
                //listId: props.listData ? props.listData._id : props.match.params.id,
				listId: props.match.params.id,
				sort: '-createdAt'
			});
			setPosts(data)
		}

		getPosts();
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
                        return <PostComp key = {post._id} post = {post} />
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
        followedLists: state.auth.anylistUser.attrs.followedLists
	}
}

export default connect(mstp, {setActiveList, followList, unfollowList})(ListPage);

const ListPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    
`;


