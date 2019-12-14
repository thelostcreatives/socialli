import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { POST_LINK_COLOR } from '../../utils/constants';

const InternalLink = (props) => {
	const { decoratedText } = props;

	const cleanText = decoratedText.replace(/\s/g, '');

	let username, tag;

	if (cleanText.includes("@")) {
		username = cleanText.split('@')[1];
	} else {
		tag = cleanText.split('#')[1];
	}

	return (
		<InternalLinkWrapper>
			{
				username ?
				<Link to = {`/${username}`}> 
					{ props.children }
				</Link>
				:
				<Link to = {`/explore/#${tag}`}> 
					{ props.children }
				</Link>
			}
			
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