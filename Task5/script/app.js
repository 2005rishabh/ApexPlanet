import { searchMovies, getMovieDetails } from './api.js';

const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('movieContainer');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

// Load default movies
window.addEventListener('DOMContentLoaded', loadDefaultMovies);

async function loadDefaultMovies() {
  const defaultQuery = 'avengers';
  const movies = await searchMovies(defaultQuery);
  displayMovies(movies);
}

// Search input
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  if (query.length > 2) {
    const movies = await searchMovies(query);
    if (movies.length > 0) {
      displayMovies(movies);
    } else {
      movieContainer.innerHTML = '<p>No movies found</p>';
    }
  } else {
    loadDefaultMovies();
  }
});

// Display movies
function displayMovies(movies) {
  movieContainer.innerHTML = '';
  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    const isFavorite = checkIfFavorite(movie.imdbID);

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="fav-btn" data-id="${movie.imdbID}">
        ${isFavorite ? '💖 Remove' : '🤍 Favorite'}
      </button>
    `;

    card.addEventListener('click', () => showDetails(movie.imdbID));
    movieContainer.appendChild(card);

    // Handle favorite button
    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent modal open
      toggleFavorite(movie.imdbID);
      displayMovies(movies); // re-render
    });
  });
}

// Show modal
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

// Favorite helpers
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

// Show Favorites
document.getElementById('showFavoritesBtn').addEventListener('click', async () => {
  const favIDs = getFavorites();
  const favMovies = [];

  for (const id of favIDs) {
    const details = await getMovieDetails(id);
    if (details) favMovies.push(details);
  }

  if (favMovies.length > 0) {
    displayMovies(favMovies);
  } else {
    movieContainer.innerHTML = '<p>No favorites yet!</p>';
  }
});
