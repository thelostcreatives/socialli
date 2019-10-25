import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getNotifs } from '../actions';
import { Notification } from './index';

const Notifications = (props) => {

	const { notifs, anylistUser } = props;
	const { getNotifs } = props;

	const { username, followedLists, followedPosts } = anylistUser.attrs;

	useEffect (() => {
		if (anylistUser._id && notifs.length === 0) {
			getNotifs(username, [...followedLists, ...followedPosts]);
		}
	}, [anylistUser]);

	// useEffect (() => {
	// 	// if (notifs.length > 0) {
	// 	// 	notifs[0].destroy();
	// 	// }
	// 	console.log(notifs)
	// }, [notifs])

	return (
		<div>
			notifs here
			{
				notifs.map((notif) => <Notification key = {notif._id} notif = {notif}/>)
			}
		</div>
	)
}

const mstp = (state) => {
	return {
		anylistUser: state.auth.anylistUser,
		notifs: state.notifs.notifications
	}
}

export default connect(mstp, {getNotifs})(Notifications);