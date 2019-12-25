import React from 'react';
import styled from 'styled-components';

import { breakpoint } from '../../utils/styleConsts';

const SearchBar = (props) => { 

	const { placeholder, onChange } = props;

	return ( 
		<SearchBarWrapper> 
			<input type = "text" placeholder = {placeholder} onChange = {onChange}/>
		</SearchBarWrapper>
	)
}

export default SearchBar;

const SearchBarWrapper = styled.div`
	min-width: 300px;
	width: 500px;
	padding: 10px;

	position: sticky;
    top: 0;
	z-index: 10;

	background: white;

	input {
		width: 100%
		padding: 5px;
		font-family: inherit;
	}

    @media only screen and (max-width: ${breakpoint.a}) {
		width: fill-available;
	}

`;