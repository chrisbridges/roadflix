let tripTimeInSeconds = 0;
// calling the Google Maps API to calculate distance / time between user inputs
function getDistance() {
	$('#trip-form').submit(function(event) {
		event.preventDefault();
		let distanceService = new google.maps.DistanceMatrixService();
  		distanceService.getDistanceMatrix({
  	  origins: [$('#origin').val()],
  	  destinations: [$('#destination').val()],
  	  travelMode: google.maps.TravelMode.DRIVING,
  	  unitSystem: google.maps.UnitSystem.IMPERIAL,
  	  avoidHighways: false,
  	  avoidTolls: false
	},
		function (response, status) { // check that user inputs are valid
		  if (status !== google.maps.DistanceMatrixStatus.OK || response.rows[0].elements[0].status === 'NOT_FOUND') {
		    alert('We\'re having some trouble loading that location right now. Try being more specific or entering a different location.');
		  } else {
		    tripTimeInSeconds = response.rows[0].elements[0].duration.value;
        $('.trip').show();
		    $('.trip-origin').text(response.destinationAddresses[0]);
		    $('.trip-destination').text(response.originAddresses[0]);
		    $('.trip-length').text(response.rows[0].elements[0].duration.text);
        haveEnoughMovies();
		    if (popularMovies.length === 0) { // if user decides to change trip locations, this prevents button from unnecessarily showing again
          $('.load-movies').show();
        }
		  }
		});
	});
}
// wrap these in an object - state management
const THE_MOVIE_DATABASE_ENDPOINT = 'https://api.themoviedb.org/3/movie/popular'; // popular movies endpoint
const THE_MOVIE_DATABASE_KEY = 'f852305411e85c5520c80f92853fd711';
const THE_MOVIE_DATABASE_IMAGE_BASEURL = 'https://image.tmdb.org/t/p'; // endpoint for movie posters
const THE_MOVIE_DATABASE_IMAGE_SIZE = '/w185';
const popularMovies = []; // storage for movies called through the popular movies endpoint
const userMovies = []; // storage for movies that user has added to their playlist
const resultsPerPage = 5; // number of movies displayed at once
let start = 0;
let end = resultsPerPage;
let pageNumber = 1; // page number of results for popular movies endpoint
// retrieves first page of movies and shows buttons to continue user flow
function retrieveFirstTwentyMovies () {
  $('.load-movies').on('click', function() {
    retrieveMovies(pageNumber);
    $('.load-movies').hide();
    $('.next-button').show();
    $('.user-movies').show();
  });
}
// calls popular movie endpoint from the Movie Database, community-driven results refreshed every 24 hours
function retrieveMovies (pageNumber) {
  const params = {
    api_key: THE_MOVIE_DATABASE_KEY,
    language: 'en-US',
    page: pageNumber
  };
  $.getJSON(THE_MOVIE_DATABASE_ENDPOINT, params, pushMoviesToStorage).done(displayMovies);
}
// push new popular movie results to our storage
function pushMoviesToStorage (response) {
  movies = response.results;
  movies.forEach(function(movie) {
    popularMovies.push(movie);
  });
  console.log(popularMovies);
}
// display page of popular movie results
function displayMovies () {
  const addMovieButton = `<button class="add-movie">Add to List</button>`;

  let output = '';
  popularMovies.slice(start, end).forEach(function(movie) {
    let moviePoster = `${THE_MOVIE_DATABASE_IMAGE_BASEURL + THE_MOVIE_DATABASE_IMAGE_SIZE + movie["poster_path"]}`;
    let movieRating = movie["vote_average"];
    output += `
    	<li>
    		<div class="movie-result">
		    	<div class="container">
			    	<img src=${moviePoster} alt="${movie.title} poster">
				    <div class="overlay">
				    	<p>${limitDescriptionLength(movie.overview)}</p>
				    </div>
			    </div>
	        	<p>${movie.title}</p>
	          <p>Rating: ${movieRating} / 10</p>
		    	${addMovieButton}
		    </div>
    	</li>`;
  });
  $('.movie-list').html(output);
}
// displays next set of popular movies on click of next button
function displayNextMovies () {
  $('.next-button').on('click', function() {
    if (end >= popularMovies.length) {
      pageNumber++;
      retrieveMovies(pageNumber);
    }
    start += resultsPerPage;
    end += resultsPerPage;
    displayMovies();
    if (start >= resultsPerPage) {
      $('.prev-button').show();
    }
  });
}
// displays prev set of popular movies on click of prev button
function displayPrevMovies () { 
  $('.prev-button').on('click', function() {
    start -= resultsPerPage;
    end -= resultsPerPage;
    displayMovies();
    if (start === 0) {
      $('.prev-button').hide();
    }
  });
}
// add user-selected movie to user list
function addMovieToUserList () {
  $('.movie-list').on('click', '.add-movie', function (event) {
  	let movieToAdd = popularMovies[$(this).closest('li').index() + start];
    findRunTimeForMovie(movieToAdd);
    userMovies.push(movieToAdd);
    $('.user-movies-list-placeholder').hide();
    displayUserList();
  });
}
// remove user-selected movie from list
function removeMovieFromUserList () {
  $('.user-movies-list').on('click', '.remove-movie', function (event) {
    userMovies.splice($(this).closest('li').index(), 1);
    $(this).closest('li').remove();
    totalRunTimeForUserMovies();
  });
}
// display movies that user has added to their list
function displayUserList () {
  const removeMovieButton = `<button class="remove-movie">Remove</button>`;

  let output = '';
  userMovies.forEach(function(movie) {
    let moviePoster = `${THE_MOVIE_DATABASE_IMAGE_BASEURL + THE_MOVIE_DATABASE_IMAGE_SIZE + movie["poster_path"]}`;
    output += `
      <li>
        <div class="movie-result">
          <div class="container">
            <img src=${moviePoster} alt="${movie.title} poster">
            <div class="overlay">
              <p>${limitDescriptionLength(movie.overview)}</p>
            </div>
          </div>
            <p>${movie.title}</p>
          ${removeMovieButton}
        </div>
      </li>`;
  });
  $('.user-movies-list').html(output);
}
// find run time for individual movie that user has selected
function findRunTimeForMovie (movie) {
	const THE_MOVIE_DATABASE_DETAILS_ENDPOINT = 'https://api.themoviedb.org/3/movie/';
	const movieID = movie.id;
	const movieDetailsEndpointWithID = `${THE_MOVIE_DATABASE_DETAILS_ENDPOINT + movieID}`;
	const params = {
		api_key: THE_MOVIE_DATABASE_KEY,
		language: 'en-US'
	};

	$.getJSON(movieDetailsEndpointWithID, params, function(response) {
		movie.runtime = response.runtime;
	}).done(totalRunTimeForUserMovies);
}
// calculates total runtime for all user selected movies
function totalRunTimeForUserMovies () {
  let totalRunTime = 0;
  let userMovieRunTimes = userMovies.forEach(function(movie) {
    totalRunTime += movie.runtime;
  });
  haveEnoughMovies(totalRunTime);
  $('.total-runtime').text(convertTotalRunTimeIntoHours(totalRunTime));
}
// tells user whether or not their total movie run time meets or exceeds the duration of their trip
function haveEnoughMovies (totalRunTime) {
  let tripTimeInMinutes = Math.round(tripTimeInSeconds / 60);
  if (totalRunTime >= tripTimeInMinutes && tripTimeInMinutes > 0) {
    $('.enough-movies-toggle').show();
  } else {
  	$('.enough-movies-toggle').hide();
  }
}
// displays runtime in a more readable format for users
function convertTotalRunTimeIntoHours (totalRunTime) {
  let hours = 0;
  if (totalRunTime >= 60) {
    while (totalRunTime >= 60) {
      hours++;
      totalRunTime -= 60;
    }
  }
  let minutes = totalRunTime;
  return `${hours} hours ${minutes} mins`;
}
//limits movie descriptions to fit within poster overlay
function limitDescriptionLength (description) {
	if (description.length > 260) {
		return description.substring(0, 261) + '...';
	}
	return description;
}
// wrap all in one function
$(document).ready(function () {
  getDistance();
  retrieveFirstTwentyMovies();
  displayNextMovies();
  displayPrevMovies();
  addMovieToUserList();
  removeMovieFromUserList();
});
