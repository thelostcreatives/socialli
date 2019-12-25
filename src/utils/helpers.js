import { CompositeDecorator } from 'draft-js';

import { IMAGE_FILE_SIZE_LIMIT } from './constants';
import { Highlighter, InternalLink, ExternalLink } from '../components';

export const uploadFile = async (userSession, dir, file, options) => {
	const gaialink = await userSession.putFile(`${dir}/${file.name}`, file, options);
	return gaialink;
}

/**
 * Check if image file size is <= 50 kb
 */
export const isImageFileSizeAcceptable = (fileSize) => {
	if ( fileSize  <= IMAGE_FILE_SIZE_LIMIT ) {
		return true;
	} else {
		return false;
	}
}

export const areAllImageFileSizesAcceptable = (images) => {
	const imageEvals = images.map(image => isImageFileSizeAcceptable(image.size));
	const allAcceptable = imageEvals.every((val) => val === true);
	return allAcceptable;
}

// referenced: https://medium.com/@chaman.k/compress-resize-and-manage-images-using-javascript-directly-from-the-browser-2a2bc08b6c5d
export const compressImage = (imgFile, callback) => {
	const quality = IMAGE_FILE_SIZE_LIMIT / imgFile.size;
	
    const fileName = imgFile.name;
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = event => {
        const img = new Image();
		img.src = event.target.result;
		
        img.onload = () => {
			const width = img.width;
			const height = img.height ;

			const elem = document.createElement('canvas');
			elem.width = width;
			elem.height = height;
			const ctx = elem.getContext('2d');

			ctx.drawImage(img, 0, 0, width, height);
			ctx.canvas.toBlob((blob) => {
				const file = new File([blob], fileName, {
					type: 'image/jpeg',
					lastModified: Date.now()
				});

				img.src = URL.createObjectURL(file);

				img.onload = function() {
					// no longer need to read the blob so it's revoked
					URL.revokeObjectURL(img.src);
				};

				//compress again in cases where it still larger than the limit
				if (file.size > IMAGE_FILE_SIZE_LIMIT) {
					compressImage(file, callback);
				} else {
					callback(file);
				}
			}, 'image/jpeg', quality);
		};
		reader.onerror = error => console.log(error);
	};
}

export const removeExtraNewLines = (plainText) => {
	const cleanText = plainText.split("\n").filter((text, idx, arr) => {
		let returnVal;
		if (idx > 0 && idx < arr.length - 1) {
			if (text.length > 0 || arr[idx + 1].length > 0) {
				returnVal = true;
			}
		} else if (idx === arr.length - 1 || idx === 0) {
			returnVal = true;
		} else {
			returnVal = false;
		}
		return returnVal;
	}).join('\n');

	return cleanText;
}

// from https://erictarn.com/post/1060722347/the-best-twitter-hashtag-regular-expression
export const HANDLE_REGEX = /\B@\w*[a-zA-Z\.]+\w*/g;
export const HASHTAG_REGEX = /\B#\w*[a-zA-Z]+\w*/g;
// modified from https://www.regextester.com/96504
export const LINK_REGEX = /(?:(?:https?):\/\/|\b(?:[a-z\d]+\.\w*[^\.\.\s"'\[\]]))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/g;

export const findWithRegex = (regex, contentBlock, callback) => {
	const text = contentBlock.getText();
	let matchArr, start;
	while ((matchArr = regex.exec(text)) !== null) {
		start = matchArr.index;
		callback(start, start + matchArr[0].length);
	}
}

export const getMatchesFromString = (regex, string) => {
	const matches = [];
	let matchArr;

	while ((matchArr = regex.exec(string)) !== null) {
		matches.push(matchArr[0]);
	}
	return matches;
}

export const handleStrategy = (contentBlock, callback, contentState) => {
	findWithRegex(HANDLE_REGEX, contentBlock, callback);
}
export const hashtagStrategy = (contentBlock, callback, contentState) => {
	findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
export const linkStrategy = (contentBlock, callback, contentState) => {
	findWithRegex(LINK_REGEX, contentBlock, callback);
}

/**
 * Current types:
 * 'editor': highlights hashtags, mentions and links
 * 'post': renders hashtags, mentions and links text with achor tags
 */
export const getCompositeDecorator = (type) => {
	const decorators = {
		editor: () => new CompositeDecorator([ 
			{ 
				strategy: handleStrategy,
				component: Highlighter
			},
			{ 
				strategy: hashtagStrategy,
				component: Highlighter
			},
			{ 
				strategy: linkStrategy,
				component: Highlighter
			}
		]),
		post: () => new CompositeDecorator([
			{
				strategy: handleStrategy,
				component: InternalLink,
			},
			{
				strategy: hashtagStrategy,
				component: InternalLink,
			},
			{
				strategy: linkStrategy,
				component: ExternalLink,
			}
		])
	};

	return decorators[type]();
}

// from https://stackoverflow.com/questions/11300906/check-if-a-string-starts-with-http-using-javascript
export const getValidUrl = (url = "") => {
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, "");

    if(/^(:\/\/)/.test(newUrl)){
        return `http${newUrl}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
        return `http://${newUrl}`;
    }

    return newUrl;
};

// array.sort() callback to sort radiks models in descending order
export const descendSortModels = (a, b) => {
	if (a.attrs.createdAt > b.attrs.createdAt) {
		return -1;
	}

	if (a.attrs.createdAt < b.attrs.createdAt) {
		return 1;
	}

	return 0;
}