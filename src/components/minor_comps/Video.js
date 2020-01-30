import React from 'react';
import styled from 'styled-components';

const Video = (props) => {

	const { src } = props;

	return (
		<VideoWrapper controls controlsList = "nodownload">
			<source src = {src}/>
		</VideoWrapper>
	);
}

export default Video;

const VideoWrapper = styled.video`
	width: 100%;
	outline: none;

	margin: 10px 0;
`;