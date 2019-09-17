import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { createPost, setActiveList } from '../actions';
import { List } from '../models';

const NewPostForm = (props) => {
	const [body, setBody] = useState("");
	const [media, setMedia] = useState("");

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${props.match.params.id}`);
			return data;
		}
		if (!props.listData){
			getListData().then(data => {
				props.setActiveList(data);
			});
		}
	}, [props.listData])

	const handleInput = (e) => {
		const nameToSetter = {
			body: setBody,
			media:	setMedia 
		}
		nameToSetter[e.target.name](e.target.value);
	}

	return (
		<div>
			<input name = "body" type = "text" placeholder = "Say something" value = {body} onChange = {handleInput}/>
			
			<button onClick = { async () => {
				await createPost(props.listData._id, body);
				props.history.push(`/profile/${props.listData._id}`)
			 } }>Post</button>
		</div>
	)
}

const mstp = (state) => {
	return {
		listData: state.lists.activeList
	}
}

export default withRouter(connect(mstp, {setActiveList})(NewPostForm));