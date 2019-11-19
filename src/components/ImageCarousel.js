import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ImageCarousel = (props) => {

	const {imgs} = props;

	const [index, setIndex] = useState(0);

	const changeIndex = (delta) => {
		let newIndex = index + delta;
		if (newIndex < 0) {
			newIndex = 0; 
		} else if (newIndex >= imgs.length) {
			newIndex = imgs.length - 1;
		}
		setIndex(newIndex);
	}

	const manageImgDimensions = (e) => {
		const height = e.target.height;
		const width = e.target.width;
		if (height > width) {
			e.target.style.height = "100%";
			e.target.style.width = "unset";
		} else {
			e.target.style.height = "initial";
			e.target.style.width = "100%";
		}
	}
	return (
		<ImageCarouselWrapper>
			<div className = "image-wrapper">
				<img src = {imgs[index]} onLoad = {manageImgDimensions}/>
			</div>
			<div className = "index-indicator-container">
				{
					imgs.length > 1 ? imgs.map( (_, idx) => {
						return (
							<div className = {`index-indicator ${idx === index ? "active": ""}`} id = {idx} key = {_}/>
						)
					})
					:
					null
				}
			</div>
			<span onClick = {() => changeIndex(-1)}>left </span>
			<span onClick = {() => changeIndex(1)}>right</span>
		</ImageCarouselWrapper>
	)
}

export default ImageCarousel;

const ImageCarouselWrapper = styled.div`

	.image-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 480px;
		img {
			width: 100%;
		}
	}

	.index-indicator-container {
		display: flex;

		.index-indicator {
			margin: 5px;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: grey;
		}

		.active {
			background: blue;
		}
	}
`
