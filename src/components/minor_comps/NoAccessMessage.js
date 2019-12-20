import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { Button } from '../index';
import { handleSignOut } from '../../actions';

const NoAccessMessage = (props) => {

	const { socialliConfig, userSession, fullWidth} = props;
	const { handleSignOut } = props;

	const { isPublic,  other: otherSocialliConfig } = socialliConfig ?  socialliConfig.attrs : {};
	const { username } = userSession.loadUserData();

	return (
		<NoAccessMessageWrapper fullWidth = {fullWidth}>
			<div>
			{ socialliConfig ? 
			(
				<>
					<h1>
						{ isPublic ?
							"You are blocked from this socialli instance."
							:
							"You are not a member of this socialli instance."
						}
					</h1>
					<p>
						<pre>
						{ isPublic ?
							otherSocialliConfig.blockedMessage
							:
							otherSocialliConfig.memberRequestMessage
						}
						</pre>
					</p>
				</>
			)
			:
			username ?
			<div>
				<h1>The host needs to set the rules before anyone can use this socialli instance.</h1>
			</div>
			:
			<div>
				<h1>
					Please set a username for your Blockstack ID
				</h1>
				<p>
					Socialli requires a username with your Blockstack ID.
				</p>
				<p>
					You can do this <a href="https://browser.blockstack.org/profiles" target="_blank" rel="noopener noreferrer">here</a>.
				</p>
			</div>
			}
			<Button onClick = { (e) => handleSignOut(e, userSession)} text = "Log Out"/>
			</div>
		</NoAccessMessageWrapper>
	)
}

const mstp = (state) => { 
	return {
		userSession: state.auth.userSession
	}
}

export default connect(mstp, {handleSignOut})(NoAccessMessage);

const NoAccessMessageWrapper = styled.div`

    font-family: 'Work Sans', sans-serif;
	height: 80vh;

	width: 500px;

	display: flex;
	flex-direction: column;
	justify-content: center;

	margin: 10px;

	p {
		max-width: 500px;
		margin: 20px 0;
	}

	${props => props.fullWidth && css`
		width: unset;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		& > div {
			width: 500px;
		}
	`}
`;