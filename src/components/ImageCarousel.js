import React, { } from 'react';
import styled from 'styled-components';

const ImageCarousel = (props) => {

	const {imgs} = props;

	return (
		<ImageCarouselWrapper>
			{imgs.map( url => {
					return (
						<img src = {url} style = {{width: "100%"}}/>
					)
				})
			}
		</ImageCarouselWrapper>
	)
}

export default ImageCarousel;

const ImageCarouselWrapper = styled.div`

`
