import React from 'react';

const NewListForm = (props) => {
	return (
		<div>
			<input type = "text" placeholder = "Title"/>
			<input type = "text" placeholder = "Description"/>
			<button>Create</button>
		</div>
	)
}

export default NewListForm;