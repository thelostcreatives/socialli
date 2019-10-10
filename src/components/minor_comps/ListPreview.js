import React, { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList } from '../../actions';

const ListPreview = (props) => {
	return (
		<StyledLink to = { `list/${props.list._id}` }>
			<ListPreviewWrapper onClick = { () => props.setActiveList(props.list)} >
				{ props.list.attrs.title }
			</ListPreviewWrapper>
		</StyledLink>
	);
}

const mstp = (props) => {
	return {

	}
}

export default connect(mstp, {setActiveList})(ListPreview);

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const ListPreviewWrapper = styled.div`
    width: 344px;
    height: 93px;
    word-break: break-word;

    display: flex;
    align-items: center;
    justify-content: center;
    
    text-align: center;

    background: #D6D6D6B3;
    border-radius: 10px;
    margin: 10px;

    font-size: 25px;
    font-family: 'Work Sans', sans-serif;
    text-decoration: none !important;

    &:hover {
        color: white;
    }
`;
