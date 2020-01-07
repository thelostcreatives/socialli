import React from 'react';
import styled from 'styled-components';

const Audio = (props) => {

	const { src } = props;

	return (
		<AudioWrapper controls controlsList = "nodownload">
			<source src = {src}/>
		</AudioWrapper>
	);
}

export default Audio;

const AudioWrapper = styled.audio`
	width: 100%;
	outline: none;

	margin: 10px 0;
`;