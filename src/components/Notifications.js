import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';

import { getNotifs, setLastSeenNotif } from '../actions';
import { Notification, FakeLink } from './index';

const Notifications = (props) => {

	const { notifs, anylistUser, hasMore } = props;
	const { getNotifs, setLastSeenNotif } = props;

	const { username, followedLists = [], followedPosts = [] } = anylistUser.attrs;

	useEffect (() => {
		if (anylistUser._id && notifs.length === 0) {
			getNotifs(username, [...followedLists, ...followedPosts], notifs.length, 20);
		}
	}, [anylistUser]);

	const loadMore = () => {
		getNotifs(username, [...followedLists, ...followedPosts], notifs.length, 20);
	}

	return (
		<NotificationsWrapper>
			{
				notifs.length > 0 ?
				<FakeLink 
					onClick = {() => setLastSeenNotif(anylistUser, notifs[0])}
					style = {{alignSelf: "flex-end"}}
				>
					Mark All as seen
				</FakeLink>
				:
				null
			}
			
			<InfiniteScroll
				pageStart = {0}
				loadMore = {loadMore}
				hasMore = {hasMore}
				loader = {<div className="loader" key={0}>Loading ...</div>}
			>
				{
					notifs.length > 0 ? notifs.map((notif) => <Notification key = {notif._id} notif = {notif}/>)
					:
					<h2 style = {{maxWidth: "500px"}}>
						There are no notifications at the moment.
					</h2>
				}
			</InfiniteScroll>
		</NotificationsWrapper>
	)
}

const mstp = (state) => {
	return {
		anylistUser: state.auth.anylistUser,
		notifs: state.notifs.notifications,
		hasMore: state.notifs.hasMore
	}
}

export default connect(mstp, {getNotifs, setLastSeenNotif})(Notifications);

const NotificationsWrapper = styled.div`
	display: flex;
	flex-direction: column;

	padding-top: 10px;
`