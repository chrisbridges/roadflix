const GOOGLE_DISTANCE_MATRIX_ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const GOOGLE_DISTANCE_MATRIX_API_KEY = 'AIzaSyA_p-CBKHLPbnsXnn6a3M-e25BxffzKBYM';


function getData () {
  const params = {
  	origins: 'San Francisco, California, USA',
  	destinations: 'Los Angeles, California, USA',
  	key: GOOGLE_DISTANCE_MATRIX_API_KEY,
  	language: 'en',
  	units: 'imperial',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  let data = $.getJSON(GOOGLE_DISTANCE_MATRIX_ENDPOINT, params);
  console.log(data);
}

$(getData);

// THIS ONE ANY BETTER? - https://developers.google.com/maps/documentation/javascript/get-api-key