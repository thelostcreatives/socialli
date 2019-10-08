import React from 'react';
import styled from 'styled-components';

import {Button} from './index';

const ConfirmationOverlay = (props) => {
	
	const {message, details, confirm , cancel}  = props;

	return (
		<ConfirmationOverlayWrapper>
			<div className = "content">
				<h2>
					{message}
				</h2>
				<p>
					{details}
				</p>
				<div>
					<Button text = "Cancel" onClick = {() => cancel()}/>
					<Button text = "Continue" onClick = {() => confirm()}/>
				</div>
			</div>
		</ConfirmationOverlayWrapper>
	)
}

export default ConfirmationOverlay;

const ConfirmationOverlayWrapper = styled.div`
	position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
	width: 100vw;
	
	display: flex;
	align-items: center;
	justify-content: center;

	background: hsla(0, 0%, 100%, 0.5);

	x-index: 20000;

	.content {
		background: white;
		display: flex
		flex-direction: column;

		align-items: center;

		width: fit-content;
		height: fit-content;
		-webkit-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
		-moz-box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);
		box-shadow: 0px 0px 20px 0px rgba(171,171,171,0.88);

	padding: 10px;
	border-radius: 10px;
	}
`;