import React, {} from 'react';

const Notification = (props) => {

	const { notif } = props;

	const { author, type, content } = notif.attrs;

	const typeToContent = {
		"COMMENT": "commented",
	}

	return (
		<div>
			<p>
				{author} {typeToContent[type]} on a post from {content.listTitle}
			</p>
		</div>
	)
}

export default Notification;