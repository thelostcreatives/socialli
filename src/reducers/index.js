import { combineReducers } from 'redux';

import auth from './authReducer';
import lists from './listReducer';
import posts from './postsReducer';
import comments from './commentsReducer';
import notifs from './notifsReducer';

export default combineReducers({
    auth,
    lists,
    posts,
    comments,
    notifs
});
