import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { getNotifs } from '../actions';
import { Notification } from './index';

const Notifications = (props) => {

	const { notifs, anylistUser, hasMore } = props;
	const { getNotifs } = props;

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
	)
}

const mstp = (state) => {
	return {
		anylistUser: state.auth.anylistUser,
		notifs: state.notifs.notifications,
		hasMore: state.notifs.hasMore
	}
}

export default connect(mstp, {getNotifs})(Notifications);