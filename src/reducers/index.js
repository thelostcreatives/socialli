import { combineReducers } from 'redux';

import auth from './authReducer';
import lists from './listReducer';
import posts from './postsReducer';

export default combineReducers({
    auth,
    lists,
    posts
});
