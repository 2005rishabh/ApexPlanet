import { searchMovies, getMovieDetails } from './api.js';

const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('movieContainer');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const showFavoritesBtn = document.getElementById('showFavoritesBtn');

let currentPage = 1;
let currentQuery = 'avengers';
let isFetching = false;
let allMovies = [];
let isFavoritesView = false;

// Load default movies on page load
window.addEventListener('DOMContentLoaded', loadDefaultMovies);

// Handle search input
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  isFavoritesView = false;

  if (query.length > 2) {
    currentQuery = query;
    currentPage = 1;
    allMovies = [];
    await fetchAndAppendMovies();
  } else {
    loadDefaultMovies();
  }
});

// Handle favorites button
showFavoritesBtn.addEventListener('click', async () => {
  const favIDs = getFavorites();
  const favMovies = [];

  for (const id of favIDs) {
    const movie = await getMovieDetails(id);
    if (movie) favMovies.push(movie);
  }

  isFavoritesView = true;
  allMovies = favMovies;
  displayMovies(favMovies);
});

// Infinite scroll listener
window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom && !isFavoritesView) {
    fetchAndAppendMovies();
  }
});

// Load default "avengers" movies
async function loadDefaultMovies() {
  currentQuery = 'avengers';
  currentPage = 1;
  allMovies = [];
  isFavoritesView = false;
  await fetchAndAppendMovies();
}

// Fetch and append movie results
async function fetchAndAppendMovies() {
  if (isFetching) return;
  isFetching = true;
  const newMovies = await searchMovies(currentQuery, currentPage);
  if (newMovies.length > 0) {
    allMovies = [...allMovies, ...newMovies];
    displayMovies(allMovies);
    currentPage++;
  }
  isFetching = false;
}

// Display movie cards
function displayMovies(movies) {
  movieContainer.innerHTML = '';
  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    const isFavorite = checkIfFavorite(movie.imdbID);
    const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';

    card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" loading="lazy" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="fav-btn" data-id="${movie.imdbID}">
        ${isFavorite ? '💖 Remove' : '🤍 Favorite'}
      </button>
    `;

    // Card click opens modal
    card.addEventListener('click', () => showDetails(movie.imdbID));

    // Favorite button click
    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent modal
      toggleFavorite(movie.imdbID);
      if (isFavoritesView) {
        allMovies = allMovies.filter(m => m.imdbID !== movie.imdbID);
      }
      displayMovies(allMovies);
    });

    movieContainer.appendChild(card);
  });
}

// Show movie modal
async function showDetails(imdbID) {
  const movie = await getMovieDetails(imdbID);
  if (!movie) return;

  modalContent.innerHTML = `
    <span class="close-btn" id="closeModal">&times;</span>
    <img src="${movie.Poster}" alt="${movie.Title}" />
    <h2>${movie.Title} (${movie.Year})</h2>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
  `;

  modalOverlay.classList.remove('hidden');

  document.getElementById('closeModal').addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  });
}

// Favorite management
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favs) {
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function checkIfFavorite(id) {
  const favs = getFavorites();
  return favs.includes(id);
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(fav => fav !== id);
  } else {
    favs.push(id);
  }
  saveFavorites(favs);
}
