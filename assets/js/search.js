"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");
  
  // Customize search input with a helpful placeholder
  searchField.placeholder = "Search for a movie...";

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeout;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function () {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(searchField.value)}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResultModal.classList.add("active");
          searchResultModal.innerHTML = ""; // Clear old results

          // Display the search term in the results header
          searchResultModal.innerHTML = `
            <p class="label">Results for</p>
            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;

          const gridList = searchResultModal.querySelector(".grid-list");

          // Check if there are results, and display a message if not
          if (movieList.length === 0) {
            gridList.innerHTML = `
              <p class="no-results-message">No movies found matching "${searchField.value}". Please try another search.</p>
            `;
          } else {
            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);
              gridList.appendChild(movieCard);
            }
          }
        }
      );
    }, 500); // Debounce time for better UX
  });
}
