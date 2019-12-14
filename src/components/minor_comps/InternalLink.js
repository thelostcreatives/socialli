import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TagSpan = (props) => {
	const { decoratedText } = props;

	const cleanText = decoratedText.replace(/\s/g, '');

	return (
		<TagSpanWrapper>
			<Link to = {`/explore/${cleanText}`}> 
					{ decoratedText }
			</Link>
		</TagSpanWrapper>
	);
};

export default TagSpan;

const TagSpanWrapper = styled.div`
	display: inline-block;
	
	a {
		text-decoration: none;
		color: blue;
	}
`;