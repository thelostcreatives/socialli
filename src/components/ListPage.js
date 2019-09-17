import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';

import { setActiveList } from '../actions';
import { List } from '../models';

const ListPage = (props) => {

	useEffect (() => {
		const getListData = async () => {
			const data = await List.findById(`${props.match.params.id}`);
			return data;
		}
		if (!props.listData){
			getListData().then(data => {
				props.setActiveList(data);
			});
		}
	}, [props.listData])

	return (
		<div>
			<p>{props.listData? props.listData.attrs.description : null}</p>
		</div>
	)
}

const mstp = (state) => {
	return {
		listData: state.lists.activeList
	}
}

export default connect(mstp, {setActiveList})(ListPage);