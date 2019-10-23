import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getNotifs } from '../actions';

const Notifications = (props) => {

	const { notifs } = props;
	const { getNotifs } = props;


	useEffect (() => {
		getNotifs();
	}, []);

	// useEffect (() => {
	// 	if (notifs.length > 0) {
	// 		notifs[0].destroy();
	// 	}
	// }, [notifs])

	return (
		<div>
			notifs here
			{
				notifs.map((notif) => {
					
					return notif.attrs ? (
						<div>
							{notif.attrs.notif_for}
						</div>
					)
					:
					null
				})
			}
		</div>
	)
}

const mstp = (state) => {
	return {
		notifs: state.notifs.notifications
	}
}

export default connect(mstp, {getNotifs})(Notifications);