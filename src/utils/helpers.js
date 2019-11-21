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
			const width = img.width > 1000 ? 1000 : img.width;
			const scaleFactor = width / img.width;
			const height = img.height * scaleFactor;

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