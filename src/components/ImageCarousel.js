import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'react-feather';

import { breakpoint } from '../utils/styleConsts';

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
				{
					index > 0 ? 
					<span 
						className = "left"
						onClick = {(e) => {
							e.stopPropagation();
							changeIndex(-1)
						}}
					>
						<ChevronLeft/>
					</span>
					:
					null
				}
				{
					index < imgs.length - 1 ?
					<span 
						className = "right"
						onClick = {(e) => {
							e.stopPropagation();
							changeIndex(1)
						}}
					>
						<ChevronRight/>
					</span>
					:
					null
				}
				
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
		position: relative;
		
		margin: 10px 0;

		img {
			width: 100%;
		}
		span {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 46%;
			border-radius: 50%;
			&:hover {
				cursor: pointer;
			}
		}
		.left {
			left: 5px;
		}
		.right {
			right: 5px;
		}
	}

	.index-indicator-container {
		display: flex;
		justify-content center;
		flex-wrap: wrap;

		.index-indicator {
			margin: 5px;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: #d2d6d7;
		}

		.active {
			background: blue;
		}
	}

	@media only screen and (max-width: ${breakpoint.b}) {
		.image-wrapper {
			height: 350px ;
		}
	}
`
