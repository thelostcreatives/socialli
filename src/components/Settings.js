import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ToggleLeft, ToggleRight } from 'react-feather';

import { Button } from './index';
import { createSocialliConfig, getSocialliConfig, updateSocialliConfig } from '../actions';
import socialli_config from '../socialli_config';

const Settings = (props) => {

	const { socialliConfig, isPublic = true, blockedUsers = [], members = [] } = props;
	const { createSocialliConfig, getSocialliConfig, updateSocialliConfig } = props;

	const { _id } = socialliConfig ? socialliConfig.attrs: {};

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
			setUpdatedBlockedUsers(blockedUsers);
			setUpdatedMembers(members);
		}
	}, [socialliConfig]);

	const handleUsernameInputChange = (e) => {
		const username = e.target.value
		setUsernameInputVal(username.replace(/\s/g, ''));
	}

	const toggleIsPublic = () => {
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
		<div>
			{
				_id ? 
				<div>
					<h1>Your Socialli Settings</h1>
					<div>
						<span>public:</span> 
						<div onClick = {toggleIsPublic}>
							{isPublic ? 
								<ToggleRight/> 
								: 
								<ToggleLeft/>
							}
						</div>
					</div>
					<h2>{isPublic ? "Blocked Users" : "Members"}</h2>
					<form onSubmit = { e => e.preventDefault()}>
						<input type = "text" placeholder = "blockstack ID" value = {usernameInputVal} onChange = {handleUsernameInputChange}/> 
						<Button onClick = {manageUsername} text = {isPublic ? "block user" : "add member"}/>
					</form>
					<ul>
						{
							isPublic ?
							updatedBlockedUsers.map(user => {
								return <li key = {user}>{user} <button onClick={() => removeUsername(user)}>x</button></li>
							})
							:
							updatedMembers.map(member => {
								return <li key = {member}>{member} <button onClick={() => removeUsername(member)}>x</button></li>
							})
						}

					</ul>
				</div>
				:
				<div>
					<h1>Loading...</h1>
				</div>
			}
		</div>
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
