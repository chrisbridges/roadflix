const GOOGLE_DISTANCE_MATRIX_ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const GOOGLE_DISTANCE_MATRIX_API_KEY = 'AIzaSyA_p-CBKHLPbnsXnn6a3M-e25BxffzKBYM';

const params = {
	origins: 'San Francisco, California, USA',
	destinations: 'Los Angeles, California, USA',
	key: GOOGLE_DISTANCE_MATRIX_API_KEY,
	language: 'en',
	units: 'imperial'
};

let data = $.getJSON(GOOGLE_DISTANCE_MATRIX_ENDPOINT, params);
console.log(data);