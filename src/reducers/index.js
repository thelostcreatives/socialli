import { combineReducers } from 'redux';

import auth from './authReducer';
import lists from './listReducer';

export default combineReducers({
    auth,
    lists,
});
