let tripTimeInSeconds = 0;

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
        $('.trip').show();
		    $('.trip-origin').text(response.destinationAddresses[0]);
		    $('.trip-destination').text(response.originAddresses[0]);
		    $('.trip-length').text(response.rows[0].elements[0].duration.text);
		    $('.load-movies').show();
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
const removeMovieButton = `<button class="remove-movie">Remove</button>`;

function retrieveFirstTwentyMovies () {
  $('.load-movies').on('click', function() {
    retrieveMovies(pageNumber);
    $('.load-movies').hide();
    //$('.prev-button').show();
    $('.next-button').show();
    $('.user-movies').show();
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
  	let movieToAdd = popularMovies[$(this).closest('li').index() + start];
    findRunTimeForMovie(movieToAdd);
    userMovies.push(movieToAdd);
    console.log(userMovies);
    displayUserList();
    //$(this).closest('button').toggleClass('hide');
    //haveEnoughMovies();
  });
}

function findRunTimeForMovie (movie) {
	const THE_MOVIE_DATABASE_DETAILS_ENDPOINT = 'https://api.themoviedb.org/3/movie/';
	const movieID = movie.id;
	const movieDetailsEndpointWithID = `${THE_MOVIE_DATABASE_DETAILS_ENDPOINT + movieID}`
	const params = {
		api_key: THE_MOVIE_DATABASE_KEY,
		language: 'en-US',
	};

	$.getJSON(movieDetailsEndpointWithID, params, function(response) {
		movie.runtime = response.runtime;
	}).done(totalRunTimeForUserMovies);
}

function totalRunTimeForUserMovies () {
  let totalRunTime = 0;
  let userMovieRunTimes = userMovies.forEach(function(movie) {
    totalRunTime += movie.runtime;
  });
  $('.total-runtime').text(totalRunTime);
  //console.log(totalRunTime);
  haveEnoughMovies(totalRunTime);
}

function displayUserList () {
	let output = '';
  userMovies.forEach(function(movie) {
    let moviePoster = `${THE_MOVIE_DATABASE_IMAGE_BASEURL + THE_MOVIE_DATABASE_IMAGE_SIZE + movie["poster_path"]}`;
    output += `<li><img src=${moviePoster} alt="${movie.title} poster"><br>${movie.title}<br>${removeMovieButton}</li>`;
  });
  $('.user-movies-list').html(output);
}

function removeMovieFromUserList () {
	$('.user-movies-list').on('click', '.remove-movie', function (event) {
    userMovies.splice($(this).closest('li').index(), 1);
    $(this).closest('li').remove();
    totalRunTimeForUserMovies();
	});
}

function haveEnoughMovies (totalRunTime) {
  let tripTimeInMinutes = Math.round(tripTimeInSeconds / 60);
  console.log(tripTimeInMinutes + ' ' + totalRunTime);
  if (totalRunTime >= tripTimeInMinutes && tripTimeInMinutes > 0) {
    $('.enough-movies-toggle').show();
  } else {
  	$('.enough-movies-toggle').hide();
  }
}

function displayMovieInfoOnMouseOver () {
	$('.movie-list').mouseover();
	$('.movie-list').mouseout();
}

$(getDistance);
$(retrieveFirstTwentyMovies);
$(displayNextFiveMovies);
$(displayPrevFiveMovies);
$(addMovieToUserList);
$(removeMovieFromUserList);
$(displayMovieInfoOnMouseOver);

