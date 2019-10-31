import React, {} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoint } from '../utils/styleConsts';

const Notification = (props) => {

	const { notif } = props;

	const { notif_for, author, type, content } = notif.attrs;

	const typeToContent = {
		"COMMENT": "commented",
	}

	return (
		<CleanLink to={`/post/${notif_for}`}>
			<NotifWrapper>
					<span className = "author">@{author} </span>
					{typeToContent[type]} on a post from
					<span className = "list-title"> {content.listTitle} </span>
					| @{content.listAuthor}
			</NotifWrapper>
		</CleanLink>
	)
}

export default Notification;

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