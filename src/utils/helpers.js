
export const uploadFile = async (userSession, dir, file, options) => {
	const gaialink = await userSession.putFile(`${dir}/${file.name}`, file, options);
	return gaialink;
}