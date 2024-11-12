"use strict";

// Helper function to add events to multiple elements, enhancing code readability and reusability
//const addEventToElements = function (elements, eventType, callback) {
 // elements.forEach((element) => element.addEventListener(eventType, callback));
//};

// Toggle the visibility of the search box on smaller screens or mobile devices
// Adds a smooth transition effect when the search icon is clicked
//const searchBox = document.querySelector("[search-box]");
//const searchTogglers = document.querySelectorAll("[search-toggler]");

//addEventToElements(searchTogglers, "click", () => {
//  searchBox.classList.toggle("active"); // toggles active class to show/hide the search box
//});

// Function to save the selected movie's ID to local storage for later retrieval
// This allows the app to fetch movie details on another page or component
//const storeMovieDetail = function (movieId) {
 // window.localStorage.setItem("movieId", String(movieId)); // Storing the ID as a string for consistency
//};

// Function to save specific list or genre parameters to local storage
// Useful for remembering user’s last selected genre or filter for continuity in experience
//const storeMovieListParams = function (urlParam, genreName) {
//  window.localStorage.setItem("urlParam", urlParam);
//  window.localStorage.setItem("genreName", genreName);
//};

"use strict";

// API base URL and key
const api_key = "35c1d5d110f7f8753fcda624065e7631";
const imageBaseURL = "https://image.tmdb.org/t/p/";

// Fetch function to get data from the server and pass it to a callback
const fetchDataFromServer = function (url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data));
};

// Save a movie to the watchlist
const addToWatchlist = function (movieId) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
};

// Get the watchlist from localStorage
const getWatchlist = function () {
  return JSON.parse(localStorage.getItem('watchlist')) || [];
};

// Generate movie card HTML
const createMovieCard = function (movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.innerHTML = `
    <img src="${imageBaseURL}w342${movie.poster_path}" alt="${movie.title}" />
    <h3>${movie.title}</h3>
    <button class="add-to-watchlist" data-id="${movie.id}">Add to Watchlist</button>
  `;
  movieCard.querySelector('.add-to-watchlist').addEventListener('click', () => addToWatchlist(movie.id));
  return movieCard;
};


