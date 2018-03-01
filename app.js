let tripTimeInSeconds;

function getDistance() {
	$('#trip-form').submit(function(event) {
		event.preventDefault();
		let distanceService = new google.maps.DistanceMatrixService();
		distanceService.getDistanceMatrix({
	  origins: [$('#origin').val()],
	  destinations: [$('#destination').val()],
	  travelMode: google.maps.TravelMode.DRIVING,
	  unitSystem: google.maps.UnitSystem.IMPERIAL,
	  //durationInTraffic: true,
	  avoidHighways: false,
	  avoidTolls: false
	},
		function (response, status) {
		  if (status !== google.maps.DistanceMatrixStatus.OK) {
		    console.log('Error:', status);
		  } else {
		    console.log(response);
		    tripTimeInSeconds = response.rows[0].elements[0].duration.value;
		    $('.trip-origin').text(response.destinationAddresses[0]);
		    $('.trip-destination').text(response.originAddresses[0]);
		    $('.trip-length').text(response.rows[0].elements[0].duration.text);
		  }
		});
	});
}

const THE_MOVIE_DATABASE_ENDPOINT = 'https://api.themoviedb.org/3/movie/popular'; // for popular movies
const THE_MOVIE_DATABASE_KEY = 'f852305411e85c5520c80f92853fd711';
const THE_MOVIE_DATABASE_IMAGE_BASEURL = 'https://image.tmdb.org/t/p';
const THE_MOVIE_DATABASE_IMAGE_SIZE = '/w500';
const popularMovies = [];

function retrieveMovies () {
  const params = {
    api_key: THE_MOVIE_DATABASE_KEY,
    language: 'en-US',
    page: 1
  };

  let data = $.getJSON(THE_MOVIE_DATABASE_ENDPOINT, params, displayMovies);
  console.log(data);
}

function displayMovies (response) {
  let movies = response.results;
  popularMovies.push(movies);
  let start = 0;
  let end = 5;
  let fiveMoviesToDisplay = movies.slice(start, end);
  const addMovieButton = `<button class="add-movie">Add to List</button>`;


  function displayFiveMovies () {
    let output = '';
    fiveMoviesToDisplay.forEach(function(movie) {
    	let moviePoster = `${THE_MOVIE_DATABASE_IMAGE_BASEURL + THE_MOVIE_DATABASE_IMAGE_SIZE + movie["poster_path"]}`;
    	let movieRating = movie["vote_average"];
      output += `<li><img src=${moviePoster}><br>${movie.title}<br>${movieRating}<br>${addMovieButton}</li>`;
    });
    $('.movie-list').html(output);
  }
  displayFiveMovies();
}

$('.load-movies').on('click', retrieveMovies);

$(getDistance);
