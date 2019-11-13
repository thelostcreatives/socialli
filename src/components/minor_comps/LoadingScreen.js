import React from 'react';
import styled from 'styled-components';

const LoadingScreen = (props) => {
	return (
		<LoadingScreenWrapper>
			<h1>
			Loading...
			</h1>
		</LoadingScreenWrapper>
	);
}

export default LoadingScreen;

const LoadingScreenWrapper = styled.div`
	height: 100vh;
	width: 100vw;

	display: flex;
	align-items: center;
	justify-content: center;

	font-family: 'Work Sans', sans-serif;
`;