import React from 'react';
import styled from 'styled-components';

import { breakpoint } from '../../utils/styleConsts';

const SearchBar = (props) => { 

	const { placeholder, value} = props;
	const { onChange, onSubmit } = props;

	return ( 
		<SearchBarWrapper> 
			<form onSubmit = {(e) => { 
				e.preventDefault();
				onSubmit(value, 0);
			}}>
				<input type = "text" placeholder = {placeholder} value = {value} onChange = {onChange}/>
			</form>
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