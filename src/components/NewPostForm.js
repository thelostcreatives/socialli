import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { createPost, setActiveList } from '../actions';
import { List } from '../models';

const NewPostForm = (props) => {
	const { 
		createPost,
		setActiveList,
		listData,
		match,
		history 
	} = props;

	const { author, title } = listData;

	const [body, setBody] = useState("");
	const [media, setMedia] = useState("");

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${match.params.id}`);
			return data;
		}
		if (listData._id !== match.params.id) {
			getListData().then(data => {
				setActiveList(data);
			});
		}
	}, [listData])

	const handleInput = (e) => {
		const nameToSetter = {
			body: setBody,
			media:	setMedia 
		}
		nameToSetter[e.target.name](e.target.value);
	}

	const handlePost = async () => {
		await createPost(
			listData._id,
			{
				listAuthor: author,
				listTitle: title
			},
			body
		);
		history.push(`/profile/${listData._id}`);
	}

	return (
		<div>
			<input name = "body" type = "text" placeholder = "Say something" value = {body} onChange = {handleInput}/>
			<button onClick = {handlePost}>Post</button>
		</div>
	);
}

const mstp = (state) => {
	return {
		listData: state.lists.activeList.attrs
	}
}

export default connect(mstp, {createPost, setActiveList})(NewPostForm);