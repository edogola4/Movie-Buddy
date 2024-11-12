"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

// Initialize the sidebar
sidebar();

// Define home page sections for dynamic movie categories
const homePageSections = [
  { title: "Upcoming Movies", path: "/movie/upcoming" },
  { title: "Weekly Trending Movies", path: "/trending/movie/week" },
  { title: "Top Rated Movies", path: "/movie/top_rated" },
];

// Prepare genre list with a helper to display genres by ID
const genreList = {
  // Converts an array of genre IDs into a comma-separated string of genre names
  asString(genreIdList) {
    return genreIdList
      .map((id) => this[id])
      .filter(Boolean) // Only include valid genre names
      .join(", ");
  },
};

// Fetch genre data, then load popular movies for the hero banner
fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  ({ genres }) => {
    genres.forEach(({ id, name }) => (genreList[id] = name));

    // After loading genres, fetch popular movies for hero banner display
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

// HERO BANNER - Displays popular movies in a banner with sliding controls
const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>
    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  let controlItemIndex = 0;

  // Iterate over movies for the hero banner
  movieList.forEach((movie, index) => {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    // Include placeholder text for missing values
    sliderItem.innerHTML = `
      <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading="${
      index === 0 ? "eager" : "lazy"
    }">
      
      <div class="banner-content">
        <h2 class="heading">${title || "Untitled Movie"}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date?.split("-")[0] ?? "Coming Soon"}</div>
          <div class="meta-item card-badge">${vote_average ? vote_average.toFixed(1) : "N/A"}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="banner-text">${overview || "No synopsis available."}</p>
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="Play icon">
          <span class="span">Watch Now</span>
        </a>
      </div>
    `;
    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex++}`);
    controlItem.innerHTML = `
      <img src="${imageBaseURL}w154${poster_path || "/assets/images/placeholder.png"}" alt="Slide to ${title || "movie"}" loading="lazy" draggable="false" class="img-cover">
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  });

  pageContent.appendChild(banner);
  addHeroSlide();

  // Load home page sections like trending and top-rated movies
  homePageSections.forEach(({ title, path }) => {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  });
};

// HERO SLIDER - Adds sliding functionality for hero banner items
const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  // Slider control event function
  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  sliderControls.forEach((control) => control.addEventListener("click", sliderStart));
};

// Creates a section for each movie list category
const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  movieList.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  });

  pageContent.appendChild(movieListElem);
};

// Initialize search functionality
search();
