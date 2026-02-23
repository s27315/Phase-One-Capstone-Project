import { getFavorites, removeFavorite } from "./favorites.js";
import { renderBooksGrid, setStatusMessage, updateFavoritesCount } from "./ui.js";

const favoritesGrid = document.getElementById("favoritesGrid");
const statusMessage = document.getElementById("statusMessage");
const favoritesCount = document.getElementById("favoritesCount");

function renderFavoritesPage() {
  const favorites = getFavorites();
  updateFavoritesCount(favoritesCount, favorites.length);

  if (!favorites.length) {
    favoritesGrid.innerHTML = "";
    setStatusMessage(
      statusMessage,
      "No favorites saved yet. Go to Home and add books to your list.",
      "info",
    );
    return;
  }

  setStatusMessage(statusMessage, "");
  renderBooksGrid(favoritesGrid, favorites, { mode: "favorites" });
}

favoritesGrid?.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-toggle");
  if (!button) return;
  const key = decodeURIComponent(button.dataset.key || "");
  removeFavorite(key);
  renderFavoritesPage();
});

renderFavoritesPage();
