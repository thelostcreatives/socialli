import React, {} from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import { breakpoint } from '../utils/styleConsts';
import { NOTIF_TYPES } from '../utils/constants';

const Notification = (props) => {

	const { username, notif, lastSeenNotif } = props;

	let { notif_for, notif_with, author, type, content, mentions, createdAt } = notif.attrs;

	if (mentions && mentions.includes(username)) { 
		type = NOTIF_TYPES.mention;
	}

	const typeToContent = {
		[NOTIF_TYPES.comment]: "commented on a post from",
		[NOTIF_TYPES.post]: "posted to ",
		[NOTIF_TYPES.mention]: "mentioned you on a post from",
	}

	return (
		<CleanLink to={`/post/${type === NOTIF_TYPES.post || type === NOTIF_TYPES.mention ? notif_with : notif_for}`}>
			<NotifWrapper isNew = {createdAt > lastSeenNotif}>
					<span className = "author">@{author} </span>
					{typeToContent[type]}
					<span className = "list-title"> {content.listTitle} </span>
					| @{content.listAuthor}
			</NotifWrapper>
		</CleanLink>
	)
}

const mstp = (state) => {
	return {
		username: state.auth.anylistUser.attrs.username,
		lastSeenNotif: state.auth.anylistUser.attrs.other.lastSeenNotif
	}
}

export default connect(mstp, {})(Notification);

const NotifWrapper = styled.div`
	padding: 10px;
	width: 500px;
	max-height: 150px;
	overflow: hidden;
	margin: 20px 0;
	#preview-overlay {
		display: block;
		position: absolute;
		z-index: 11;
		top: 0;
		left: 0;
		&:hover {
			cursor: pointer;
			background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,212,255,0) 100%);
		}
		width: 100%;
		height: 100%;
	}

	${props => props.isNew && css`
		background: hsla(186, 76%, 81%, 0.30);
	`}

	.list-title {
		font-weight: 600;
	}

	&:hover {
		cursor: pointer;
		background: #f7f7f7;
	}

	@media only screen and (max-width: ${breakpoint.a}) {
		max-width: 500px;
		width: 100%;
		// margin: 10px;
		.icons-container {
			width: unset;
		}
	}

	@media only screen and (max-width: ${breakpoint.b}) {
		width: 100%;
		max-width: 500px;
	}
`;

const CleanLink = styled(Link)`
	text-decoration: none;
`