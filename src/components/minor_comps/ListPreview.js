import React, { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList } from '../../actions';

const ListPreview = (props) => {
	return (
		<StyledLink to = { `list/${props.list._id}` }>
			<ListPreviewWrapper onClick = { () => props.setActiveList(props.list)} >
                <h2>
                { props.list.attrs.title }
                </h2>
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
    width: 300px;;
    height: 93px;
    word-break: break-word;

    display: flex;
    align-items: center;

    background: #D6D6D6B3;
    border-radius: 10px;
    margin: 10px;

    &:hover {
        color: white;
    }

    h2 {
        font-size: 25px;
        font-family: 'Work Sans', sans-serif;
        font-weight: normal;
        margin-left: 10px;
    }
`;
