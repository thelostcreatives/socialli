import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList } from '../actions';
import { List, Post } from '../models';
import PostComp from './Post';

const ListPage = (props) => {

	const [posts, setPosts] = useState([]);

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${props.match.params.id}`);
			return data;
		}
		if (!props.listData){
			getListData().then(data => {
				props.setActiveList(data);
			});
		}
	}, [props.listData])

	useEffect (() => {
		const getPosts = async () => {
			const data = await Post.fetchList({
				listId: props.listData ? props.listData._id : props.match.params.id
			});
			setPosts(data)
		}

		getPosts();
	}, [])

	return (
		<ListPageWrapper>
			<p>{props.listData? props.listData.attrs.description : null}</p>
			<ul>
				{
					posts.map(post => {
                        return <PostComp key = {post._id} post = {post} />
					})
				}
			</ul>
		</ListPageWrapper>
	)
}

const mstp = (state) => {
	return {
		listData: state.lists.activeList
	}
}

export default connect(mstp, {setActiveList})(ListPage);

const ListPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    
`;


