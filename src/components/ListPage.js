import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';
import { XSquare } from 'react-feather';

import { Button, NewPostForm, ConfirmationOverlay } from './index';
import { Header } from './Profile';
import { setActiveList, followList, unfollowList, getPosts, updateList, deleteList } from '../actions';
import { List } from '../models';
import { breakpoint } from '../utils/styleConsts';
import PostComp from './Post';

const ListPage = (props) => {

	const { hasMore, listPosts, getPosts, setActiveList, followList, unfollowList, match, history, listData, anylistUser, followedLists, updateList, deleteList, deletingList} = props;

	const isOwned = listData.attrs.signingKeyId === anylistUser.attrs.signingKeyId;

	const posts = listPosts[match.params.id] ? listPosts[match.params.id] : [];

	const { title, author, description, other } = listData.attrs;

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreatingPost, setIsCreatingPost] = useState(false);
	const [listPageData, setListPageData] = useState({});

	useEffect (() => {
		setListPageData({
			title,
			description,
			other
		})
	}, [listData])

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

	const handleInputChange = (e) => {
		const target = e.target;
		let value = target.value;
		let name = target.name;

		const dataInOther = []

		if (dataInOther.includes(name)) {
			const otherData = name;
			name = "other";
			value = {
				...listPageData.other,
				[otherData]: value
			}
		}

		setListPageData({
			...listPageData,
			[name] : value
		});
	}

	const handleUpdateClick = () => {
		setIsEditing(false);
		updateList(listData, listPageData);
	}

	const handleDeleteClick = () => {
		setIsDeleting(true);
	}

	const handleCancelClick = () => {
		setIsDeleting(false);
	}

	const handleDelete = () => {
		deleteList(listData, () => history.push(`/${anylistUser.attrs.username}`));
	}

	const handleNewPostClick = () => {
		setIsCreatingPost(true);
	}

	const doneCreatingPost = () => {
		setIsCreatingPost(false);
	}

	return (
		<ListPageWrapper>
			{
				isDeleting ? 
				deletingList ?
				<div>
					<h2>Deleting List</h2>
					<p>Do not close this tab while deleting all your posts.</p>
				</div>
				:
				<ConfirmationOverlay
					message = "Delete List?"
					details = "This will delete the list and all posts within the list."
					confirm = {handleDelete}
					cancel = {handleCancelClick}
				/>
				:
				<>
					<Header>
						{
							!isEditing ?
							<div>
								<h1 id = "name">{listData ? title : null}</h1>
								<h2 id = "username">{ author }</h2>
								<p>{listData? description : null}</p>
							</div>
							:
							<div className = "profile-inputs">
								<label htmlFor = "title">Title</label>
								<input type = "text" placeholder = "List title" value = {listPageData.title} name = "title" onChange = {handleInputChange}/>
								<label htmlFor = "description">Description</label>
								<textarea className = "description" type = "text" placeholder = "Tell people about this list" value = {listPageData.description} name = "description" onChange = {handleInputChange}/>
							</div>

						}

						<div className = "icons-container">
							<div>
								{
									!isCreatingPost && isOwned ?
									<Button onClick = {handleNewPostClick} text = "New Post"/>
									:
									null
								}
							</div>
							{
								isOwned ? 
								<div>
									{
										!isEditing ?
										<Button onClick = {() => setIsEditing(true)} text = "Edit"/>
										:
										<div className = "edit-options">
											<Button onClick = {handleUpdateClick} text = "Update"/>
											<XSquare onClick = {handleDeleteClick} className = "delete"/>
										</div>
									}
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
					{
						isCreatingPost ?
						<NewPostForm match = {match} done = {doneCreatingPost}/>
						:
						null
					}
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
				</>

			}
			
		</ListPageWrapper>
	)
}

const mstp = (state) => {
	return {
        listData: state.lists.activeList,
        anylistUser: state.auth.anylistUser,
		followedLists: state.auth.anylistUser.attrs.followedLists ? state.auth.anylistUser.attrs.followedLists : [],
		listPosts: state.posts.lists,
		hasMore: state.posts.listHasMore,
		deletingList: state.lists.deletingList
	}
}

export default connect(mstp, {setActiveList, followList, unfollowList, getPosts, updateList, deleteList})(ListPage);

const ListPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

	font-family: 'Work Sans', sans-serif;
	
	.edit-options {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
	}
	
	.delete {
        color: #e86813;
        &:hover {
            cursor: pointer;
            color: #e81313;
        }
	}
`;


