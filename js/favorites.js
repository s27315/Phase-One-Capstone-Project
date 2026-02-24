// localStorage key used by this app.
const FAVORITES_KEY = "bookExplorerFavorites";
// Fallback cover (we skip these in favorites).
const DEFAULT_COVER = "assets/default-cover.svg";

// Check if the saved book has a real cover image.
function hasRealCover(book) {
  const cover = book && book.coverUrl ? book.coverUrl : "";
  return Boolean(cover) && cover !== DEFAULT_COVER;
}

// Read favorites safely from localStorage.
function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(hasRealCover) : [];
  } catch {
    // If JSON parsing fails, return empty list.
    return [];
  }
}

// Save favorites list to localStorage.
function writeFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Public: get latest favorites.
export function getFavorites() {
  return readFavorites();
}

// Public: check if one book is in favorites.
export function isFavorite(bookKey) {
  return readFavorites().some((book) => book.key === bookKey);
}

// Public: add a book to favorites if not already present.
export function addFavorite(book) {
  const favorites = readFavorites();

  // Stop duplicates.
  if (favorites.some((item) => item.key === book.key)) {
    return favorites;
  }

  // Put new book first in the list.
  const updated = [book, ...favorites];
  writeFavorites(updated);
  return updated;
}

// Public: remove a book from favorites by key.
export function removeFavorite(bookKey) {
  const updated = readFavorites().filter((book) => book.key !== bookKey);
  writeFavorites(updated);
  return updated;
}
