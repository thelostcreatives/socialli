import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ToggleLeft, ToggleRight, XSquare } from 'react-feather';
import styled from 'styled-components';

import { Button } from './index';
import { createSocialliConfig, getSocialliConfig, updateSocialliConfig } from '../actions';
import socialli_config from '../socialli_config';

const Settings = (props) => {

	const { socialliConfig, isPublic = true, blockedUsers = [], members = [] } = props;
	const { createSocialliConfig, getSocialliConfig, updateSocialliConfig } = props;

	const { _id } = socialliConfig ? socialliConfig.attrs: {};

	const [isPublicIndicator, setIsPublicIndicator] = useState(isPublic);
	const [updatedBlockedUsers, setUpdatedBlockedUsers] = useState(blockedUsers);
	const [updatedMembers, setUpdatedMembers] = useState(members);

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
		}
	}, [socialliConfig]);

	const handleUsernameInputChange = (e) => {
		const username = e.target.value
		setUsernameInputVal(username.replace(/\s/g, ''));
	}

	const toggleIsPublic = () => {
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
				:
				<div>
					<h1>Loading...</h1>
				</div>
			}
		</SettingsWrapper>
	);
}

const mstp = (state) => {
	const config = state.settings.socialliConfig.attrs;
	return {
		socialliConfig: state.settings.socialliConfig,
		isPublic: config.isPublic,
		blockedUsers: config.blockedUsers,
		members: config.members
	}
}

export default connect(mstp, { createSocialliConfig, getSocialliConfig, updateSocialliConfig})(Settings);

const SettingsWrapper = styled.div`
	width: 500px;
	
	form {
		display: flex;
		justify-content: space-between;

		margin: 10px 0;

		input {
			border: 1px solid #d2d6d7;
			padding: 5px;
			font-family: inherit;
			font-size: 15px;
			width: 300px;
		}
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

`;

const Option = styled.div`
	display: flex;
	justify-content: space-between;
	align-self: center;
	margin-top: 10px;
	padding: 5px;
	align-items: center;
`;