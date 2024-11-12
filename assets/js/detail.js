"use strict";

// Importing essential modules for the app, including API configuration, sidebar setup, and reusable components
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

// Retrieve the movie ID from local storage to display detailed info for the selected movie
const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

// Initialize the sidebar
sidebar();

// Helper function to extract genres from a genre list and format them as a string
const getGenres = function (genreList) {
  return genreList.map(({ name }) => name).join(", ");
};

// Helper function to get the top 10 cast members for display
const getCasts = function (castList) {
  return castList.slice(0, 10).map(({ name }) => name).join(", ");
};

// Helper function to retrieve only directors from the crew list
const getDirectors = function (crewList) {
  return crewList.filter(({ job }) => job === "Director").map(({ name }) => name).join(", ");
};

// Filters the video list to return only YouTube trailers and teasers
const filterVideos = function (videoList) {
  return videoList.filter(({ type, site }) => 
    (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

// Fetch and display detailed movie information from the server
fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: { countries: [{ certification } = { certification: "N/A" }] },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    // Update the page title based on the movie title
    document.title = `${title} - Movie | Buddy`;

    // Build the HTML structure for displaying movie details
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
      <div class="backdrop-image" style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}')"></div>
      
      <figure class="poster-box movie-poster">
        <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover">
      </figure>
      
      <div class="detail-box">
        <div class="detail-content">
          <h1 class="heading">${title}</h1>
          <div class="meta-list">
            <div class="meta-item">
              <img src="./assets/images/star.png" width="20" height="20" alt="rating">
              <span class="span">${vote_average.toFixed(1)}</span>
            </div>
            <div class="separator"></div>
            <div class="meta-item">${runtime}m</div>
            <div class="separator"></div>
            <div class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</div>
            <div class="meta-item card-badge">${certification}</div>
          </div>
          <p class="genre">${getGenres(genres)}</p>
          <p class="overview">${overview}</p>
          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Starring</p>
              <p>${getCasts(cast)}</p>
            </div>
            <div class="list-item">
              <p class="list-name">Directed By</p>
              <p>${getDirectors(crew)}</p>
            </div>
          </ul>
        </div>
        <div class="title-wrapper">
          <h3 class="title-large">Trailers and Clips</h3>
        </div>
        <div class="slider-list">
          <div class="slider-inner"></div>
        </div>
      </div>
    `;

    // Append filtered YouTube trailers and teasers to the "Trailers and Clips" section
    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.innerHTML = `
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
          frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
      `;
      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    // Append the movie detail section to the main content area
    pageContent.appendChild(movieDetail);

    // Fetch and display recommended movies
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );
  }
);

// Function to display a list of recommended movies
const addSuggestedMovies = function ({ results: movieList }) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">You May Also Like</h3>
    </div>
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  // Add each suggested movie as a card to the slider
  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // uses the createMovieCard component from movie_card.js
    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  // Append the recommended movies section to the main content area
  pageContent.appendChild(movieListElem);
};

// Initialize search functionality
search();
