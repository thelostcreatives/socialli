import React from 'react';
import styled from 'styled-components';

import { getValidUrl } from '../../utils/helpers';

const ExternalLink = (props) => {
	const { decoratedText } = props;
	
	let link = getValidUrl(decoratedText);

	return (
		<ExternalLinkWrapper>
			<a href = { link } target = "_blank" rel = "noopener noreferrer"> 
					{ decoratedText }
			</a>
		</ExternalLinkWrapper>
	);
};

export default ExternalLink;

const ExternalLinkWrapper = styled.div`
	display: inline-block;
	
	a {
		text-decoration: none;
		color: blue;
	}
`;