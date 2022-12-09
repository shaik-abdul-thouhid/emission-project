const getLocation = async (address) => {
	try {
		const result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ address }&key=AIzaSyAMHmvxTgc0IucoQkMM-NTjnrtJYDDOX3Y`);
		const parse = await result.json();
		return {
			response: true,
			location: parse.results[0].geometry.location
		}
	}
	catch (error) {
		return {
			response: false,
		};
	}
}

module.exports = { getLocation };
