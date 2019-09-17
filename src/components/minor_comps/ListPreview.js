import React, { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList } from '../../actions';

const ListPreview = (props) => {
	return (
		<Link to = { `profile/${props.list._id}` }>
			<ListPreviewWrapper onClick = { () => props.setActiveList(props.list)} >
				{ props.list.attrs.title }
			</ListPreviewWrapper>
		</Link>
	);
}

const mstp = (props) => {
	return {

	}
}

export default connect(mstp, {setActiveList})(ListPreview);

const ListPreviewWrapper = styled.div`
	background: blue;
`;