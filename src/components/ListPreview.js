import React, { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ListPreview = (props) => {
	return (
		<Link to = { `profile/${props.list._id}` }>
			<ListPreviewWrapper>
				{ props.list.attrs.title }
			</ListPreviewWrapper>
		</Link>
	);
}

export default ListPreview;

const ListPreviewWrapper = styled.div`
	background: blue;
`;