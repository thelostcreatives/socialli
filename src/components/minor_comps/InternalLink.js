import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { POST_LINK_COLOR } from '../../utils/constants';

const InternalLink = (props) => {
	const { decoratedText } = props;

	const cleanText = decoratedText.replace(/\s/g, '');

	return (
		<InternalLinkWrapper>
			<Link to = {`/explore/${cleanText}`}> 
					{ props.children }
			</Link>
		</InternalLinkWrapper>
	);
};

export default InternalLink;

const InternalLinkWrapper = styled.div`
	display: inline-block;
	
	a {
		text-decoration: none;
		color: ${POST_LINK_COLOR};
	}
`;