import React from 'react';
import styled from 'styled-components';

const TagSpan = (props) => {
	const { decoratedText } = props;

	const cleanText = decoratedText.replace(/\s/g, '');

	return (
		<TagSpanWrapper>
			{ decoratedText }
		</TagSpanWrapper>
	);
};

export default TagSpan;

const TagSpanWrapper = styled.span`
	color: blue;
`;