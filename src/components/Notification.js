import React, {} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
					{typeToContent[type]} on a post on
					<span className = "list-title"> {content.listTitle}</span>
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
`;

const CleanLink = styled(Link)`
	text-decoration: none;
`