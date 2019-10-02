import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Button } from './index';
import { createList } from '../actions';

const posts_types = [
	"text posts",
	"media posts"
]

const NewListForm = (props) => {

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [posts_type, setPostsType] = useState("");

	const handleInput = (e) => {
		const nameToSetter = {
			title: setTitle,
			description: setDescription,
			posts_type: setPostsType
		}
		nameToSetter[e.target.name](e.target.value);
	}
	return (
		<NewPostFormWrapper>
			<label htmlFor = "title">Title</label>
			<input name = "title" type = "text" placeholder = "Title" value = {title} onChange = {handleInput}/>
			<label htmlFor = "description">Description</label>
			<textarea className = "description" name = "description" type = "text" placeholder = "Description" value = {description} onChange = {handleInput}/>
			{/* <select>
				{
					posts_types.map(type => {
						return <option value = {type}>{type}</option>
					})
				}
			</select> */}
			<Button onClick = { async () => {
				const newList = await props.createList(title, description, props.author, posts_type);
				props.history.push(`profile/${newList._id}`)
			 } } text = "Create"/>
		</NewPostFormWrapper>
	)
	
}

const mstp = (state) => {
    return {
        author: state.auth.anylistUser.attrs.username
    }
}

export default connect(mstp, {createList})(NewListForm);

const NewPostFormWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 500px;

	label {
		font-weight: bold;
		margin-top: 10px;
	}
	
	input {
		border: 1px solid #d2d6d7;
		padding: 5px;
		font-family: inherit;
		font-size: 15px;
		width: 100%;
	}

	.description {
		border: 1px solid #d2d6d7;
		padding: 5px;
		font-family: inherit;
		font-size: 15px;
		max-width: 100%;
		min-width: 100%;
		padding: 5px
		height: 100px;
	}
`;