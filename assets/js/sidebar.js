"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {
  const genreList = {};

  // Fetch genres from the server and populate the genre list
  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }
      genreLink();
    }
  );

  // Create the sidebar container
  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  // Add a personalized greeting at the top
  sidebarInner.innerHTML = `
  <div class="sidebar-header">
    <p class="welcome-message">Hello, movie lover! 🎬</p>
  </div>
  <div class="sidebar-list">
    <p class="title">Genre</p>
  </div>
  <div class="sidebar-list">
    <p class="title">Language</p>

    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=en", "English")'>English</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=zh", "Mandarin")'>Mandarin</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=es", "Spanish")'>Spanish</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=fr", "French")'>French</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=ar", "Arabic")'>Arabic</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=pt", "Portuguese")'>Portuguese</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=ru", "Russian")'>Russian</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=ja", "Japanese")'>Japanese</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=ms", "Malay")'>Malay</a>
    <a href="./movie-list.html" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>
      <a href="./movie-list.html" menu-close class="sidebar-link"
     onclick='getMovieList("with_original_language=sw", "Kiswahili")'>Kiswahili</a>
  </div>

  <div class="sidebar-footer">
        <h3 class="credit">Designed with <i class="fa fa-heart pulse"></i> by Brandon<a href="https://github.com/edogola4">from Nairobi, Kenya</a></h3>
        <p href="https://github.com/edogola4">&copy; 2024 Movie Buddy. All rights reserved.</p>
    
    <img src="./assets/images/tmdb-logo.png" width="130" height="17" alt="the movie database logo" />
  </div>
`;


  // Function to create genre links dynamically
  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      // Add each genre to the genre list in the sidebar
      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    // Append the completed sidebar to the main sidebar container
    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  // Toggle sidebar with smooth animation
  const toggleSidebar = function (sidebar) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    // Add smooth toggle effect to each element
    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}
