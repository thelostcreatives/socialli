import React, { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setActiveList } from '../../actions';

const ListPreview = (props) => {
    const { list } = props;

    const { setActiveList } = props;

    const { title, other } = list.attrs;

	return (
		<StyledLink to = { `list/${list._id}` }>
			<ListPreviewWrapper onClick = { () => setActiveList(list)} >
                <h2>
                { title }
                </h2>
                {
                    other && other.bannerLink ?
                    <img src = {other.bannerLink} alt = "Banner"/>
                    :
                    null
                }
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

    position: relative;

    display: flex;
    align-items: center;

    background: hsla(0, 0%, 95%, 0.69);
    border-radius: 10px;
    margin: 10px;

    overflow: hidden;

    &:hover {
        color: white;
        background: hsla(0, 0%, 10%, 0.69);
    }

    h2 {
        font-size: 25px;
        font-family: 'Work Sans', sans-serif;
        font-weight: normal;
        margin-left: 10px;
    }

    img {
        position: absolute;
        z-index: -1;
        width: 100%;
    }
`;
