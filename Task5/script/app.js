import { searchMovies, getMovieDetails } from './api.js';

const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('movieContainer');

// Fetch and display default movies on page load
window.addEventListener('DOMContentLoaded', loadDefaultMovies);

async function loadDefaultMovies() {
  const defaultQuery = 'avengers'; // You can change this to any default keyword
  const movies = await searchMovies(defaultQuery);
  displayMovies(movies);
}

// Search functionality
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
    loadDefaultMovies(); // Fallback to default if input cleared
  }
});

// Display search results or default movies
function displayMovies(movies) {
  movieContainer.innerHTML = '';
  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;
    card.addEventListener('click', () => showDetails(movie.imdbID));
    movieContainer.appendChild(card);
  });
}

// Show movie details in modal
async function showDetails(imdbID) {
  const movie = await getMovieDetails(imdbID);
  if (!movie) return;

  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');

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
