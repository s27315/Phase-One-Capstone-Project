// Favorites page logic: render saved books and handle remove.
import { getFavorites, removeFavorite } from "./favorites.js";
import { renderBooksGrid, setStatusMessage, updateFavoritesCount } from "./ui.js";

// Page elements.
const favoritesGrid = document.getElementById("favoritesGrid");
const statusMessage = document.getElementById("statusMessage");
const favoritesCount = document.getElementById("favoritesCount");

// Render favorites list or empty state.
function renderFavoritesPage() {
  const books = getFavorites();
  updateFavoritesCount(favoritesCount, books.length);

  if (!books.length) {
    favoritesGrid.innerHTML = "";
    setStatusMessage(statusMessage, "No favorites saved yet. Go to Home and add books to your list.");
    return;
  }

  setStatusMessage(statusMessage, "");
  renderBooksGrid(favoritesGrid, books, { mode: "favorites" });
}

// Remove item when clicking "Remove" on this page.
favoritesGrid?.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-toggle");
  if (!button) return;
  const key = decodeURIComponent(button.dataset.key || "");
  removeFavorite(key);
  renderFavoritesPage();
});

renderFavoritesPage();
