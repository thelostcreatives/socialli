import React, { useState, useEffect } from 'react';

import { Post } from '../models';
import { PostComp } from './index';

const UserFeed = (props) => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        Post.fetchList({
            sort: '-createdAt'
        }).then(posts => {
            setPosts(posts);
        })
    }, [])
    return (
        <div>
            USER FEED HERE
            {
                posts.map(post => {
                    return <PostComp post={post} />;
                })
            }
        </div>
    )
}

export default UserFeed;
