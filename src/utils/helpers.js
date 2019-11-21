import { IMAGE_FILE_SIZE_LIMIT } from './constants';

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