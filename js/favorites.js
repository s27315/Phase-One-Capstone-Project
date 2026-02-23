const FAVORITES_KEY = "bookExplorerFavorites";

function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function getFavorites() {
  // Always return normalized list from storage for a fresh UI state.
  return readFavorites();
}

export function isFavorite(bookKey) {
  return readFavorites().some((book) => book.key === bookKey);
}

export function addFavorite(book) {
  const favorites = readFavorites();
  if (favorites.some((item) => item.key === book.key)) {
    return favorites;
  }
  const updated = [book, ...favorites];
  writeFavorites(updated);
  return updated;
}

export function removeFavorite(bookKey) {
  const updated = readFavorites().filter((book) => book.key !== bookKey);
  writeFavorites(updated);
  return updated;
}
