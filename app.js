//const GOOGLE_DISTANCE_MATRIX_ENDPOINT = 'https://maps.googleapis.com/maps/api/js?';
//const GOOGLE_DISTANCE_MATRIX_API_KEY = 'AIzaSyCVOn7x1xNbdv1XJgTqsoBORyZ7q1HZkaM';


/*function getData () {
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

$(getData);*/

// THIS ONE ANY BETTER? - https://developers.google.com/maps/documentation/javascript/get-api-key
/*function initMap () {
	 let map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 39.5, lng: -98.35},
	  zoom: 5
	});

	var bounds = new google.maps.LatLngBounds;
  var markersArray = [];

  var origin1 = {lat: 55.93, lng: -3.118};
  var origin2 = 'Greenwich, England';
  var destinationA = 'Stockholm, Sweden';
  var destinationB = {lat: 50.087, lng: 14.421};

  var destinationIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=D|FF0000|000000';
  var originIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=O|FFFF00|000000';
  /*var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.53, lng: 9.4},
    zoom: 10
  });
  var geocoder = new google.maps.Geocoder;

  var service = new google.maps.DistanceMatrixService;
  service.getDistanceMatrix({
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    if (status !== 'OK') {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';
      deleteMarkers(markersArray);

  var showGeocodedAddressOnMap = function(asDestination) {
    var icon = asDestination ? destinationIcon : originIcon;
    return function(results, status) {
      if (status === 'OK') {
        map.fitBounds(bounds.extend(results[0].geometry.location));
        markersArray.push(new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: icon
        }));
      } else {
        alert('Geocode was not successful due to: ' + status);
      }
    };
  };

      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
        geocoder.geocode({'address': originList[i]},
            showGeocodedAddressOnMap(false));
        for (var j = 0; j < results.length; j++) {
          geocoder.geocode({'address': destinationList[j]},
              showGeocodedAddressOnMap(true));
          outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
              ': ' + results[j].distance.text + ' in ' +
              results[j].duration.text + '<br>';
        }
      }
    }
  });
}

  function deleteMarkers(markersArray) {
    for (var i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray = [];
  }
}*/

/*const THE_MOVIE_DATABASE_ENDPOINT = 'https://api.themoviedb.org/3';
const THE_MOVIE_DATABASE_KEY = 'f852305411e85c5520c80f92853fd711';

const params = {
	api_key: THE_MOVIE_DATABASE_KEY,
	language: 'en-US',
	page: 1
};

let data = $.getJSON(THE_MOVIE_DATABASE_ENDPOINT, params);
console.log(data);
*/

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.themoviedb.org/3/movie/popular?page=1&language=en-US&api_key=f852305411e85c5520c80f92853fd711",
  "method": "GET",
  "headers": {},
  "data": "{}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});



