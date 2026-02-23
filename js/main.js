import { fetchBooksByTitle } from "./fetchBooks.js";
import { addFavorite, getFavorites, removeFavorite } from "./favorites.js";
import {
  readBookFromDataset,
  renderBooksGrid,
  renderLoading,
  setStatusMessage,
  updateFavoritesCount,
} from "./ui.js";

const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const booksGrid = document.getElementById("booksGrid");
const statusMessage = document.getElementById("statusMessage");
const favoritesCount = document.getElementById("favoritesCount");
const DEFAULT_QUERY = "bestsellers";

function refreshCount() {
  updateFavoritesCount(favoritesCount, getFavorites().length);
}

function handleFavoriteToggle(event) {
  const button = event.target.closest(".favorite-toggle");
  if (!button) return;

  // Rebuild the exact book object from the card button data attributes.
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

async function searchBooks(query) {
  setStatusMessage(statusMessage, "");
  renderLoading(booksGrid);
  try {
    const books = await fetchBooksByTitle(query);
    if (!books.length) {
      booksGrid.innerHTML = "";
      setStatusMessage(statusMessage, "No results found. Try a different title.");
      return;
    }
    renderBooksGrid(booksGrid, books, { mode: "browse" });
  } catch (error) {
    booksGrid.innerHTML = "";
    setStatusMessage(statusMessage, error.message || "Something went wrong while fetching books.", "error");
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput?.value?.trim() || "";
  if (!query) return;
  await searchBooks(query);
});

booksGrid?.addEventListener("click", handleFavoriteToggle);

refreshCount();
searchBooks(DEFAULT_QUERY);
