import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
	Person,
} from 'blockstack';

import { ListPreview, Button, NewListForm  } from './index';
import { handleSignOut, setActiveProfile, updateUser, getProfileLists } from '../actions';
import { AnyListUser, List } from '../models';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const Profile = (props) => {

	const { user, userSession, activeProfile, match, history, lists } = props;

	const { handleSignOut, setActiveProfile, updateUser, getProfileLists } = props;

	const isOwned = user.attrs.signingKeyId === activeProfile.attrs.signingKeyId;

	let { username, name, description, other } = activeProfile.attrs;

	if ( !other ) {
		other = {
			avatarUrl: avatarFallbackImage
		}
	}

	const [person, setPerson] = useState({
		name() {
			return 'Anonymous';
		},
		avatarUrl() {
			return avatarFallbackImage;
		},
	});

	const [isEditing, setIsEditing] = useState(false);
	const [isCreatingList, setIsCreatingList] = useState(false);
	const [profileData, setProfileData] = useState({})

	useEffect(() => {
		AnyListUser.fetchList({
			username: match.params.id
		}).then(anylistUser => {
			setActiveProfile(anylistUser[0]);
		}).catch(err => {
			console.log(err);
		});
	}, [match.params.id]);

	useEffect (() => {
		setProfileData({username, name, description, other})
	}, [match.params.id]);

	useEffect(() => {
		getProfileLists(match.params.id);
		setPerson(new Person(userSession.loadUserData().profile));
	},[match.params.id]);

	const handleInputChange = (e) => {
		const target = e.target;
		let value = target.value;
		let name = target.name;

		const dataInOther = ["avatarUrl"]

		if (dataInOther.includes(name)) {
			const otherData = name;
			name = "other";
			value = {
				...profileData.other,
				[otherData]: value
			}
		}

		setProfileData({
			...profileData,
			[name] : value
		});
	}

	const handleNewListClick = () => {
		setIsCreatingList(true);
	}

	const cancelNewList = () => {
		setIsCreatingList(false);
	}

	return (
		<ProfileWrapper>
			<Header>
				<div className="info-section">
					<img src={ typeof(other.avatarUrl) !== "undefined" ? other.avatarUrl : avatarFallbackImage } id = "avatar-image" alt=""/>
					{
						isEditing ? 
						<div className = "profile-inputs">
							<label htmlFor = "avatarUrl">Avatar
							<input type = "text" placeholder = "Avatar url" value = {profileData.other.avatarUrl ? profileData.other.avatarUrl : ""} name = "avatarUrl" onChange = {handleInputChange}/>
						</label>
							<label htmlFor = "name">Name</label>
							<input type = "text" placeholder = "Your beautiful name" value = {profileData.name ? profileData.name : ""} name = "name" onChange = {handleInputChange}/>
							<label htmlFor = "description">Description</label>
							<textarea className = "description" type = "text" placeholder = "Tell people about yourself" value = {profileData.description ? profileData.description : ""} name = "description" onChange = {handleInputChange}/>
						</div>
						:
						<div>
							<h1 id = "name">{ name }</h1>
							<h2 id = "username">{ username }</h2>
							<p id = "description">{ description }</p>
						</div>
					}
				</div>

				<div className="icons-container">
					<div>
						{
							!isCreatingList ?
							<Button onClick = {handleNewListClick} text = "New List"/>
							:
							null
						}
					</div>
					{isOwned ? 
						<div>
							{
								isEditing ?
								<Button onClick = {() => {
									setIsEditing(false);
									updateUser(user, profileData);
								}} text = "Update"/>
								:
								<Button onClick = {() => {
									setIsEditing(true);
								}} text = "Edit"/>

							}
							<Button
								onClick = { (e) => handleSignOut(e, userSession) }
								text = "Log Out"
							/>
						</div>
						: 
						null
					}
				</div>
			</Header>
			{
				isCreatingList ?
				<NewListForm cancel = {cancelNewList} history = {history}/>
				:
				null
			}
				
			<Grid>
				{
					lists.map(list => {
						return <ListPreview key = {list._id} list = { list } isOwned = {isOwned} author = {match.params.id}>{list.attrs.title}</ListPreview>
					})
				}
			</Grid>
		</ProfileWrapper> 
	);
}

const mstp = state => {
	return {
		userSession: state.auth.userSession,
		user: state.auth.anylistUser,
		activeProfile: state.auth.activeProfile,
		lists: state.lists.profileLists
	}
}

export default connect(mstp, {handleSignOut, setActiveProfile, updateUser, getProfileLists})(Profile);

const ProfileWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 10px 0;
	#avatar-image {
		width: 100px;
		border-radius: 50%;
	}
`;

export const Header = styled.div`
	width: 500px;
	font-family: 'Work Sans', sans-serif;

	#name {
		margin-bottom: 0;
	}

	#username {
		margin: 0;
		font-size: 15px;
		font-weight: inherit;
	}
	.info-section {
		display: flex;
		flex-direction: column;
	}

	.icons-container {
		border-bottom: 1px solid #d2d6d7;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-self: center;
		margin-top: 10px;
		padding: 5px;
	}

	.profile-inputs {
		display: flex;
		flex-direction: column;

		label {
			font-weight: bold;
			margin-top: 10px;
		}
		
		input {
			border: 1px solid #d2d6d7;
			padding: 5px;
			font-family: inherit;
			font-size: 15px;
			width: 100%;
		}

		.description {
			border: 1px solid #d2d6d7;
			padding: 5px;
			font-family: inherit;
			font-size: 15px;
			max-width: 100%;
			min-width: 100%;
			padding: 5px
			height: 100px;
		}
	}
	
`;

const Grid = styled.div`
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	justify-content: center;
`;