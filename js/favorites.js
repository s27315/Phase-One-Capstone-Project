// LocalStorage helpers for favorites data.
const FAVORITES_KEY = "bookExplorerFavorites";

// Read favorites safely from localStorage.
function readFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    const list = saved ? JSON.parse(saved) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Save full favorites array to localStorage.
function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

// Get favorites for rendering pages.
export function getFavorites() {
  return readFavorites();
}

// Check if a specific book is already saved.
export function isFavorite(bookKey) {
  return readFavorites().some((book) => book.key === bookKey);
}

// Add a book only if it is not already in favorites.
export function addFavorite(book) {
  const list = readFavorites();
  if (list.some((item) => item.key === book.key)) return list;
  const updated = [book, ...list];
  saveFavorites(updated);
  return updated;
}

// Remove a book by key.
export function removeFavorite(bookKey) {
  const updated = readFavorites().filter((book) => book.key !== bookKey);
  saveFavorites(updated);
  return updated;
}
