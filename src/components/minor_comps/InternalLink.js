import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setSearchString, searchPosts } from '../../actions';
import { POST_LINK_COLOR } from '../../utils/constants';

const InternalLink = (props) => {
	const { decoratedText } = props;

	const { setSearchString, searchPosts } = props;

	const cleanText = decoratedText.replace(/\s/g, '');

	let username;

	if (cleanText.includes("@")) {
		username = cleanText.split('@')[1];
	}

	const handleTagClick = () => { 
		setSearchString(decoratedText);
		searchPosts(decoratedText);
	}

	return (
		<InternalLinkWrapper>
			{
				username ?
				<Link to = {`/${username}`}> 
					{ props.children }
				</Link>
				:
				<Link to = {`/explore/`} onClick = {handleTagClick}> 
					{ props.children }
				</Link>
			}
			
		</InternalLinkWrapper>
	);
};

const mstp = (state) => { 
	return { 
		
	}
}

export default connect(mstp, {setSearchString, searchPosts})(InternalLink);

const InternalLinkWrapper = styled.div`
	display: inline-block;
	
	a {
		text-decoration: none;
		color: ${POST_LINK_COLOR};
	}
`;