import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
	Person,
} from 'blockstack';

import { ListPreview, Button  } from './index';
import { handleSignOut, setActiveProfile } from '../actions';
import { AnyListUser, List } from '../models';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const Profile = (props) => {

	const { user, isOwned, userSession, activeProfile, handleSignOut, setActiveProfile, match  } = props;

	let { username, name, description, other } = isOwned ? user.attrs : activeProfile.attrs;

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

	const [lists, setLists] = useState([]);

	useEffect(() => {
		if (!isOwned) {
			AnyListUser.fetchList({
				username: match.params.id
			}).then(anylistUser => {
				setActiveProfile(anylistUser[0]);
			}).catch(err => {
				console.log(err);
			});
		}
	}, [])

	useEffect(() => {

		if (isOwned) {
			List.fetchOwnList().then(data => {
				setLists(data);
			}).catch(err => {
				console.log(err)
			});
		} else {
			List.fetchList({
				author: match.params.id
			}).then(data => {
				setLists(data);
			}).catch(err => {
				console.log(err)
			});
		}

		setPerson(new Person(userSession.loadUserData().profile));
	},[])

	return (
		<ProfileWrapper>
			<Header>
				<div className="info-section">
					<img src={ typeof(other.avatarUrl) !== "undefined" ? other.avatarUrl : avatarFallbackImage } id = "avatar-image" alt=""/>
					<h1 id = "name">{ name }</h1>
					<h2 id = "username">{ username }</h2>
					<p id = "description">{ description }</p>
				</div>

				<div className="icons-container">
					{isOwned ? 
						<div>
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
				
			<Grid>
				{
					lists.map(list => {
						return <ListPreview key = {list._id} list = { list } isOwned = {isOwned}>{list.attrs.title}</ListPreview>
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
		activeProfile: state.auth.activeProfile
	}
}

export default connect(mstp, {handleSignOut, setActiveProfile})(Profile);

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
        justify-content: flex-end;
        align-self: center;
		margin-top: 10px;
		padding: 5px;
	}
	
`;

const Grid = styled.div`
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	justify-content: center;
`;