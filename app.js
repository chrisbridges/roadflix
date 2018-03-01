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
const THE_MOVIE_DATABASE_IMAGE_SIZE = '/w185';
const popularMovies = [];
const userMovies = [];
const resultsPerPage = 5;
let start = 0;
let end = resultsPerPage;
let pageNumber = 1;
const addMovieButton = `<button class="add-movie">Add to List</button>`;

function retrieveFirstTwentyMovies () {
  $('.load-movies').on('click', function() {
    retrieveMovies(pageNumber);
    $('.load-movies').hide();
    //$('.prev-button').show();
    $('.next-button').show();
  });
}

function retrieveMovies (pageNumber) {
  const params = {
    api_key: THE_MOVIE_DATABASE_KEY,
    language: 'en-US',
    page: pageNumber
  };
  // done ensures movies are only displayed after properly stored - ask Jillian for more details
  $.getJSON(THE_MOVIE_DATABASE_ENDPOINT, params, pushMoviesToStorage).done(displayFiveMovies);
}

function pushMoviesToStorage (response) {
  movies = response.results;
  movies.forEach(function(movie) {
    popularMovies.push(movie);
  });
  console.log(popularMovies);
}

function displayFiveMovies () {
  console.log(start + ' ' +  end);
  let output = '';
  popularMovies.slice(start, end).forEach(function(movie) {
    let moviePoster = `${THE_MOVIE_DATABASE_IMAGE_BASEURL + THE_MOVIE_DATABASE_IMAGE_SIZE + movie["poster_path"]}`;
    let movieRating = movie["vote_average"];
    output += `<li><img src=${moviePoster} alt="${movie.title} poster"><br>${movie.title}<br>Rating: ${movieRating} / 10<br>${addMovieButton}</li>`;
  });
  $('.movie-list').html(output);
}

function displayNextFiveMovies () {
  $('.next-button').on('click', function() {
    if (end >= popularMovies.length) {
      pageNumber++;
      retrieveMovies(pageNumber);
    }
    start += resultsPerPage;
    end += resultsPerPage;
    displayFiveMovies();
    if (start >= resultsPerPage) {
      $('.prev-button').show();
    }
  });
}

function displayPrevFiveMovies () { 
  $('.prev-button').on('click', function() {
    start -= resultsPerPage;
    end -= resultsPerPage;
    displayFiveMovies();
    if (start === 0) {
      $('.prev-button').hide();
    }
  });
}

function addMovieToUserList () {
  $('.movie-list').on('click', '.add-movie', function (event) {
    //userMovies.push($(this).closest('li'));
    console.log($(this).closest('li').index());
    console.log(userMovies);
  });
}

$(getDistance);
$(retrieveFirstTwentyMovies);
$(displayNextFiveMovies);
$(displayPrevFiveMovies);
$(addMovieToUserList);


