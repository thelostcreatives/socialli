import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
	Person,
} from 'blockstack';

import { ListPreview, Button, NewListForm  } from './index';
import { handleSignOut, setActiveProfile, updateUser, getProfileLists, uploadAvatar } from '../actions';
import { AnyListUser } from '../models';
import { breakpoint } from '../utils/styleConsts';
import { isImageFileSizeAcceptable, compressImage } from '../utils/helpers';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const Profile = (props) => {

	const { user, userSession, activeProfile, match, history, lists, uploadingAvatar } = props;

	const { handleSignOut, setActiveProfile, updateUser, getProfileLists, uploadAvatar } = props;

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
	}, [activeProfile.attrs]);

	useEffect(() => {
		getProfileLists(match.params.id);
		setPerson(new Person(userSession.loadUserData().profile).toJSON());
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

	const handleAvatarClick = () => {
		document.getElementById("avatar-input").click();
	}

	const handleAvatarUpload = (e) => {
		let file = e.target.files[0];
		
		if (isImageFileSizeAcceptable(file.size)) {
			uploadAvatar(userSession, user, file);
		} else {
			compressImage(file, (compressed) => { 
				file = compressed;
				uploadAvatar(userSession, user, file);
			});
		}
	}

	return (
		<ProfileWrapper>
			<Header>
				<div className="info-section">
					<img src={ other.avatarUrl || avatarFallbackImage } id = "avatar-image" alt = "Avatar"/>
					{
						isEditing ? 
						<div className = "profile-inputs">
							<label htmlFor = "name">Name</label>
							<input type = "text" placeholder = "Your beautiful name" value = {profileData.name ? profileData.name : person.name } name = "name" onChange = {handleInputChange}/>

							<label htmlFor = "description">Description</label>
							<textarea className = "description" type = "text" placeholder = "Tell people about yourself" value = {profileData.description ? profileData.description : person.description} name = "description" onChange = {handleInputChange}/>
						</div>
						:
						<div>
							<h1 id = "name">{ name || "Anonymous" }</h1>
							<h2 id = "username">{ username }</h2>
							<p id = "description">{ description }</p>
						</div>
					}
				</div>

				<input type = "file" id = "avatar-input" accept = "image/*" hidden = 'hidden' onChange = {handleAvatarUpload}/>

				<div className="icons-container">
					<div>
						{
							!isCreatingList && isOwned ?
							<Button onClick = {handleNewListClick} text = "New List"/>
							:
							null
						}
					</div>
					{isOwned ? 
						<div>
							{
								isEditing ?
								<div>
									<Button onClick = {handleAvatarClick} disabled = {uploadingAvatar} text = {uploadingAvatar ? "Uploading" : "Avatar"}/>
									<Button onClick = {() => {
										setIsEditing(false);
										updateUser(user, profileData);
									}} text = "Update"/>
								</div>
								:
								<div>
									<Button onClick = {() => {
										setIsEditing(true);
									}} text = "Edit"/>
									<Button
										onClick = { (e) => handleSignOut(e, userSession) }
										text = "Log Out"
									/>
								</div>
							}
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
						return <ListPreview key = {list._id} list = { list } isOwned = {isOwned} author = {match.params.id}/>
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
		uploadingAvatar: state.auth.uploadingAvatar,
		lists: state.lists.profileLists
	}
}

export default connect(mstp, {handleSignOut, setActiveProfile, updateUser, getProfileLists, uploadAvatar})(Profile);

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

	#description {
		margin: 10px 0;
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

	@media only screen and (max-width: ${breakpoint.a}) {
		max-width: 500px;
		width: -webkit-fill-available;
		margin: 10px;
		.icons-container {
			width: unset;
		}
	}

	@media only screen and (min-width: ${breakpoint.b}) {
		width: 500px;
	}
	
`;

const Grid = styled.div`
	display: flex;
	width: 100%;
	max-width: 1000px;
	flex-wrap: wrap;
	justify-content: center;
`;