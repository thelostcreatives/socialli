import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { createSocialliConfig, getSocialliConfig } from '../actions';
import socialli_config from '../socialli_config';

const Settings = (props) => {

	const { socialliConfig } = props;
	const { createSocialliConfig, getSocialliConfig } = props;

	const { isPublic, blocked_users, members } = socialliConfig ? socialliConfig.attrs: {};

	const { updatedBlockedUsers, setUpdatedBlockedUsers } = useState(members);
	const { updatedMembers, setUpdatedMembers } = useState(members);

	useEffect(() => {
		if (!socialliConfig) {
			getSocialliConfig(socialli_config.host, createSocialliConfig);
		}
	}, []);

	return (
		<div>
			{
				socialliConfig ? 
				<div>
					<h1>Your Socialli Settings</h1>
					public: {isPublic ? "true" : "false"}
					<h2>{isPublic ? "Blocked Users" : "Members"}</h2>
					<button>+</button>
					<ul>
						{
							isPublic ?
							blocked_users.map(user => {
								return <li key = {user}>{user}</li>
							})
							:
							members.map(member => {
								return <li key = {member}>{member}</li>
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
	return {
		socialliConfig: state.settings.socialliConfig
	}
}

export default connect(mstp, { createSocialliConfig, getSocialliConfig})(Settings);
