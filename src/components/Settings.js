import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ToggleLeft, ToggleRight, XSquare } from 'react-feather';
import styled from 'styled-components';

import { Button } from './index';
import { createSocialliConfig, getSocialliConfig, updateSocialliConfig } from '../actions';
import { breakpoint } from '../utils/styleConsts';
import socialli_config from '../socialli_config';

const Settings = (props) => {

	const { socialliConfig } = props;
	const { createSocialliConfig, getSocialliConfig, updateSocialliConfig } = props;
	const { _id } = socialliConfig;

	const { isPublic = true, blockedUsers = [], members = [], other } = socialliConfig.attrs;

	const [isPublicIndicator, setIsPublicIndicator] = useState(isPublic);
	const [updatedBlockedUsers, setUpdatedBlockedUsers] = useState(blockedUsers);
	const [updatedMembers, setUpdatedMembers] = useState(members);
	const [message, setMessage] = useState("");
	const [usernameInputVal, setUsernameInputVal] = useState("");

	useEffect(() => {
		if (!_id) {
			getSocialliConfig(socialli_config.host, createSocialliConfig);
		}
	}, []);

	useEffect (() => {
		if (_id) {
			setIsPublicIndicator(isPublic);
			setUpdatedBlockedUsers(blockedUsers);
			setUpdatedMembers(members);

			if (isPublic) {
				setMessage(other.blockedMessage);
			} else {
				setMessage(other.memberRequestMessage);
			}
		}
	}, [socialliConfig]);

	const handleUsernameInputChange = (e) => {
		const username = e.target.value
		setUsernameInputVal(username.replace(/\s/g, ''));
	}

	const handleMessageInputChange = (e) => {
		setMessage(e.target.value);
	}

	const toggleIsPublic = () => {
		if (!isPublicIndicator) {
			setMessage(other.blockedMessage ? other.blockedMessage : "");
		} else {
			setMessage(other.memberRequestMessage ? other.memberRequestMessage : "");
		}
		setIsPublicIndicator(!isPublicIndicator);
		updateSocialliConfig(socialliConfig, {
			isPublic: !isPublic
		});

		
	}

	const manageUsername = () => {
		if (usernameInputVal !== socialli_config.host) {
			let newList;
			if (isPublic) {
				if (!updatedBlockedUsers.includes(usernameInputVal)) {
					newList = [...updatedBlockedUsers, usernameInputVal];
					setUpdatedBlockedUsers(newList);
					updateSocialliConfig(socialliConfig, {
						blockedUsers: newList
					});
				}
			} else {
				if (!updatedMembers.includes(usernameInputVal)) {
					newList = [...updatedMembers, usernameInputVal];
					setUpdatedMembers(newList);
					updateSocialliConfig(socialliConfig, {
						members: newList
					});
				}
			}
		};

		setUsernameInputVal("");
	}

	const manageMessage = () => {
		if (isPublicIndicator) {
			updateSocialliConfig(socialliConfig, {
				other: {
					...other,
					blockedMessage: message
				}
			});
		} else {
			updateSocialliConfig(socialliConfig, {
				other: {
					...other,
					memberRequestMessage: message
				}
			});
		}
	}

	const removeUsername = (username) => {
		let newList;
		if (isPublic) {
			newList = updatedBlockedUsers.filter(user => user !== username);
			setUpdatedBlockedUsers(newList);
			updateSocialliConfig(socialliConfig, {
				blockedUsers: newList
			});
			
		} else {
			newList = updatedMembers.filter(member => member !== username);
			setUpdatedMembers(newList);
			updateSocialliConfig(socialliConfig, {
				members: newList
			});
		}
	}

	return (
		<SettingsWrapper>
			{
				_id ? 
				<div>
					<h1>Your Socialli Settings</h1>
					<Option>
						<span>Public:</span> 
						<div onClick = {toggleIsPublic}>
							{isPublicIndicator ? 
								<ToggleRight/> 
								: 
								<ToggleLeft/>
							}
						</div>
					</Option>

					<h2>{isPublicIndicator ? "Blocked Message" : "Membership Request Message"}</h2>
					<textarea id = "message" placeholder = "Message" value = {message} onChange = {handleMessageInputChange}/> 
					{
						(isPublicIndicator && other.blockedMessage !== message) || (!isPublicIndicator && other.memberRequestMessage !== message) ?
						<Button onClick = {manageMessage} text = "Save"/>
						:
						null
					}
					<div className = "userlist">
						<h2>{isPublicIndicator ? "Blocked Users" : "Members"}</h2>
						<form onSubmit = { e => e.preventDefault()}>
							<input type = "text" placeholder = "blockstack ID" value = {usernameInputVal} onChange = {handleUsernameInputChange}/> 
							<Button onClick = {manageUsername} text = {isPublicIndicator ? "block user" : "add member"}/>
						</form>
						<ul>
							{
								isPublicIndicator ?
								updatedBlockedUsers.map(user => {
									return <li key = {user}>{user} <XSquare onClick={() => removeUsername(user)} className = "delete" /></li>
								})
								:
								updatedMembers.map(member => {
									return <li key = {member}>{member} <XSquare onClick={() => removeUsername(member)} className = "delete" /></li>
								})
							}

						</ul>
					</div>
				</div>
				:
				<div>
					<h1>Loading...</h1>
				</div>
			}
		</SettingsWrapper>
	);
}

const mstp = (state) => {
	return {
		socialliConfig: state.settings.socialliConfig,
	}
}

export default connect(mstp, { createSocialliConfig, getSocialliConfig, updateSocialliConfig})(Settings);

const SettingsWrapper = styled.div`
	width: 500px;
	
	input {
		border: 1px solid #d2d6d7;
		padding: 5px;
		font-family: inherit;
		font-size: 15px;
		width: 300px;
	}

	#message {
		border: 1px solid #d2d6d7;
		font-family: inherit;
		font-size: 15px;
		max-width: 100%;
		min-width: 100%;
		margin: 10px 0;
		padding: 5px;
		height: 100px;
	}

	form {
		display: flex;
		justify-content: space-between;

		margin: 10px 0;
	}

	.userlist {
		margin-top: 30px;
	}

	ul {
		margin: 10px 0;

		li {
			display: flex;
			justify-content: space-between;
		}
	}

	.delete {
		&:hover {
			cursor: pointer; 
		}
	}

	svg {
		&:hover {
			cursor: pointer;
		}
	}

    @media only screen and (max-width: ${breakpoint.a}) {
		width: 100%;
		padding: 10px;

		form {
			flex-direction: column;
		}
	}
`;

const Option = styled.div`
	display: flex;
	justify-content: space-between;
	align-self: center;
	margin-top: 10px;
	padding: 5px;
	align-items: center;
`;