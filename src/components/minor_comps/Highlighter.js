import React from 'react';
import styled from 'styled-components';

import { POST_LINK_COLOR } from '../../utils/constants';

const Highlighter = (props) => {
	return (
		<HighlighterWrapper>
			{ props.children }
		</HighlighterWrapper>
	);
};

export default Highlighter;

const HighlighterWrapper = styled.span`
	color: ${POST_LINK_COLOR};
`;