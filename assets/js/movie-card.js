"use strict";

import { imageBaseURL } from "./api.js";

// Creates a movie card element for each movie
export function createMovieCard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");

  // Check for missing data and provide default values where necessary
  const movieTitle = title || "Untitled";
  const movieRating = vote_average ? vote_average.toFixed(1) : "N/A";
  const movieYear = release_date ? release_date.split("-")[0] : "Unknown Year";
  const posterURL = poster_path 
    ? `${imageBaseURL}w342${poster_path}` 
    : "./assets/images/placeholder.png"; // Fallback poster image

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img src="${posterURL}" alt="${movieTitle} Poster" class="img-cover" loading="lazy">
    </figure>
    
    <h4 class="title">${movieTitle}</h4>
    
    <div class="meta-list">
      <div class="meta-item rating">
        <img src="./assets/images/star.png" width="20" height="20" loading="lazy" alt="Star icon for rating">
        <span class="span">${movieRating}</span>
      </div>
    
      <div class="card-badge">${movieYear}</div>
    </div>
    
    <a href="./detail.html" class="card-btn" title="View details for ${movieTitle}" onclick="getMovieDetail(${id})">
      <span class="sr-only">Go to details for ${movieTitle}</span>
    </a>
  `;

  // Add hover effect for better interaction feedback
  card.addEventListener("mouseenter", () => {
    card.classList.add("hovered");
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("hovered");
  });

  return card;
}
