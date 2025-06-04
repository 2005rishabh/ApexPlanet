const products = [
  { id: 1, name: "Smartphone", category: "electronics", price: 299, rating: 4.5, image: "https://images.unsplash.com/photo-1424798985931-3325521d26e6?w=500&auto=format&fit=crop&q=60" },
  { id: 2, name: "Laptop", category: "electronics", price: 899, rating: 4.8, image: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=500&auto=format&fit=crop&q=60" },
  { id: 3, name: "Jeans", category: "clothing", price: 45, rating: 4.2, image: "https://images.unsplash.com/photo-1637069585336-827b298fe84a?w=500&auto=format&fit=crop&q=60" },
  { id: 4, name: "T-Shirt", category: "clothing", price: 25, rating: 4.0, image: "https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?w=500&auto=format&fit=crop&q=60" },
  { id: 5, name: "Novel", category: "books", price: 15, rating: 4.6, image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=500&auto=format&fit=crop&q=60" },
  { id: 6, name: "Science Book", category: "books", price: 60, rating: 4.7, image: "https://images.unsplash.com/photo-1711526601867-65aadc6580c0?w=500&auto=format&fit=crop&q=60" }
];

const productGrid = document.getElementById('product-grid');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortSelect = document.getElementById('sort');
const searchInput = document.getElementById('search-input');

function renderProducts(list) {
  productGrid.innerHTML = '';
  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <p>Price: $${product.price}</p>
      <p>Rating: ⭐ ${product.rating}</p>
    `;
    productGrid.appendChild(card);
  });
}

function filterAndSort() {
  let filtered = [...products];

  const category = categoryFilter.value;
  const priceRange = priceFilter.value;
  const sortOption = sortSelect.value;
  const searchQuery = searchInput.value.toLowerCase();

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Filter by price
  if (priceRange !== 'all') {
    filtered = filtered.filter(p => {
      if (priceRange === 'low') return p.price < 50;
      if (priceRange === 'medium') return p.price >= 50 && p.price <= 100;
      if (priceRange === 'high') return p.price > 100;
    });
  }

  // Filter by search
  if (searchQuery) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery));
  }

  // Sort
  if (sortOption === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(filtered);
}

// Initial render
renderProducts(products);

// Event listeners
categoryFilter.addEventListener('change', filterAndSort);
priceFilter.addEventListener('change', filterAndSort);
sortSelect.addEventListener('change', filterAndSort);
searchInput.addEventListener('input', filterAndSort);
