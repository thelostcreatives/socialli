import React, { useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
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
		<div>
			<input name = "title" type = "text" placeholder = "Title" value = {title} onChange = {handleInput}/>
			<input name = "description" type = "text" placeholder = "Description" value = {description} onChange = {handleInput}/>
			<select>
				{
					posts_types.map(type => {
						return <option value = {type}>{type}</option>
					})
				}
			</select>
			<button onClick = { async () => {
				const newList = await createList(title, description, posts_type);
				props.history.push(`profile/${newList._id}`)
			 } }>Create</button>
		</div>
	)
	
}

export default withRouter(NewListForm);