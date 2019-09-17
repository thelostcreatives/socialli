import { Post } from '../models';

export const createPost = async (listId, content) => {
	const newPost = new Post({
		listId,
		content
	});

	const post = await newPost.save();
	return post;
}