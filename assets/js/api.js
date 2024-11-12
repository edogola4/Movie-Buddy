"use strict"; // Use strict mode for better code quality and to catch potential errors

// Your personal API key for accessing movie data
const api_key = "35c1d5d110f7f8753fcda624065e7631"; 
// Base URL for fetching images from the TMDB API
const imageBaseURL = "https://image.tmdb.org/t/p/";

/**
 * Function to fetch data from the server using the provided URL.
 * It then passes the result in JSON format to the callback function.
 * An optional parameter can also be passed to the callback function if needed.
 * 
 * @param {string} url - The API endpoint to fetch data from.
 * @param {function} callback - The callback function to process the response.
 * @param {string} optionalParam - An optional parameter that can be passed to the callback.
 */
const fetchDataFromServer = function (url, callback, optionalParam) {
  // Fetch data from the API using the provided URL
  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => callback(data, optionalParam)); // Pass the parsed data to the callback
};

// Export the necessary elements for use in other modules
export { imageBaseURL, api_key, fetchDataFromServer };
