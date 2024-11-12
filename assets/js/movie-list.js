"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const genreName = window.localStorage.getItem("genreName") || "Popular";
const urlParam = window.localStorage.getItem("urlParam") || "sort_by=popularity.desc";

const pageContent = document.querySelector("[page-content]");

// Call the sidebar function to initialize the sidebar
sidebar();

let currentPage = 1;
let totalPages = 0;

// Function to load movies based on genre and pagination
function loadMovies(page = 1) {
  fetchDataFromServer(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&include_adult=false&page=${page}&${urlParam}`,
    function ({ results: movieList, total_pages }) {
      totalPages = total_pages;

      document.title = `${genreName} Movies - Movie Buddy`; // Dynamic page title

      // Create or find the movie list section
      let movieListElem = document.querySelector(".movie-list");
      if (!movieListElem) {
        movieListElem = document.createElement("section");
        movieListElem.classList.add("movie-list", "genre-list");
        movieListElem.ariaLabel = `${genreName} Movies`;
        
        movieListElem.innerHTML = `
          <div class="title-wrapper">
            <h1 class="heading">Discover ${genreName} Movies</h1>
            <p class="description">Explore popular and trending ${genreName} movies. Click "Load More" to browse through additional titles.</p>
          </div>
          
          <div class="grid-list"></div>
          
          <button class="btn load-more" load-more>Load More</button>
        `;
        
        pageContent.appendChild(movieListElem);
      }

      // Add movie cards based on fetched results
      const gridList = movieListElem.querySelector(".grid-list");
      for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        gridList.appendChild(movieCard);
      }

      // Update the Load More button state
      const loadMoreBtn = movieListElem.querySelector("[load-more]");
      if (currentPage >= totalPages) {
        loadMoreBtn.textContent = "No More Movies to Load";
        loadMoreBtn.disabled = true;
        loadMoreBtn.classList.add("disabled");
      } else {
        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.disabled = false;
        loadMoreBtn.classList.remove("disabled");
      }

      // Event listener for loading more movies
      loadMoreBtn.addEventListener("click", function () {
        if (currentPage < totalPages) {
          currentPage++;
          this.classList.add("loading");
          loadMovies(currentPage); // Recursive call to load the next page
          this.classList.remove("loading");
        }
      });
    }
  );
}

// Initial call to load the first page of movies
loadMovies(currentPage);

// Initialize search functionality
search();
