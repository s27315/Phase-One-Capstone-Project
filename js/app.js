import { fetchBooksByTitle, fetchPopularAfricanBooks } from "./fetchBooks.js";
import { addFavorite, getFavorites, removeFavorite } from "./favorites.js";
import {
  readBookFromDataset,
  renderBooksGrid,
  renderLoading,
  setStatusMessage,
  updateFavoritesCount,
} from "./ui.js";

// Shared footer element (exists on all pages).
const favoritesCount = document.getElementById("favoritesCount");

// Home page elements.
const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const booksGrid = document.getElementById("booksGrid");

// Favorites page element.
const favoritesGrid = document.getElementById("favoritesGrid");

// Status element (exists on Home and Favorites pages).
const statusMessage = document.getElementById("statusMessage");

// Update footer favorites number.
function refreshCount() {
  updateFavoritesCount(favoritesCount, getFavorites().length);
}

// Home: handle add/remove favorite from book cards.
function handleHomeFavoriteToggle(event) {
  const button = event.target.closest(".favorite-toggle");
  if (!button) {
    return;
  }

  const book = readBookFromDataset(button);
  const shouldRemove = button.textContent.toLowerCase().includes("remove");

  if (shouldRemove) {
    removeFavorite(book.key);
    button.textContent = "Add Favorite";
    button.classList.remove("bg-rose-100", "text-rose-700", "hover:bg-rose-200");
    button.classList.add("bg-indigo-100", "text-indigo-700", "hover:bg-indigo-200");
    setStatusMessage(statusMessage, `"${book.title}" removed from favorites.`, "success");
  } else {
    addFavorite(book);
    button.textContent = "Remove Favorite";
    button.classList.remove("bg-indigo-100", "text-indigo-700", "hover:bg-indigo-200");
    button.classList.add("bg-rose-100", "text-rose-700", "hover:bg-rose-200");
    setStatusMessage(statusMessage, `"${book.title}" added to favorites.`, "success");
  }

  refreshCount();
}

// Home: search books by title.
async function searchBooks(query) {
  setStatusMessage(statusMessage, "");
  renderLoading(booksGrid);

  try {
    const books = await fetchBooksByTitle(query);
    if (!books.length) {
      booksGrid.innerHTML = "";
      setStatusMessage(statusMessage, "No results with available covers found. Try a different title.");
      return;
    }

    renderBooksGrid(booksGrid, books, { mode: "browse" });
  } catch (error) {
    booksGrid.innerHTML = "";
    setStatusMessage(statusMessage, error.message || "Something went wrong while fetching books.", "error");
  }
}

// Home: load default list when page opens.
async function loadPopularAfricanBooks() {
  setStatusMessage(statusMessage, "");
  renderLoading(booksGrid);

  try {
    const books = await fetchPopularAfricanBooks();
    if (!books.length) {
      booksGrid.innerHTML = "";
      setStatusMessage(statusMessage, "No African popular books with covers found right now.");
      return;
    }

    renderBooksGrid(booksGrid, books, { mode: "browse" });
    setStatusMessage(statusMessage, "Showing books popular in Africa.", "success");
  } catch (error) {
    booksGrid.innerHTML = "";
    setStatusMessage(statusMessage, error.message || "Could not load African popular books.", "error");
  }
}

// Favorites page: render saved books.
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

// Favorites page: handle remove button click.
function handleFavoritesPageClick(event) {
  const button = event.target.closest(".favorite-toggle");
  if (!button) {
    return;
  }

  const key = decodeURIComponent(button.dataset.key || "");
  removeFavorite(key);
  renderFavoritesPage();
}

// Always refresh count first (all pages).
refreshCount();

// If Home page is open, attach Home logic.
if (form && searchInput && booksGrid && statusMessage) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
      return;
    }
    await searchBooks(query);
  });

  booksGrid.addEventListener("click", handleHomeFavoriteToggle);
  loadPopularAfricanBooks();
}

// If Favorites page is open, attach Favorites logic.
if (favoritesGrid && statusMessage) {
  favoritesGrid.addEventListener("click", handleFavoritesPageClick);
  renderFavoritesPage();
}
