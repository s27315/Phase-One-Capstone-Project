// Home page logic: search, render, and favorite toggle.
import { fetchBooksByTitle, fetchPopularAfricanBooks } from "./fetchBooks.js";
import { addFavorite, getFavorites, removeFavorite } from "./favorites.js";
import { readBookFromDataset, renderBooksGrid, renderLoading, setStatusMessage, updateFavoritesCount } from "./ui.js";

// Get important elements once.
const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const booksGrid = document.getElementById("booksGrid");
const statusMessage = document.getElementById("statusMessage");
const favoritesCount = document.getElementById("favoritesCount");

// Keep button styles in constants for easy reuse.
const addClass = "favorite-toggle mt-4 rounded-md px-3 py-2 text-sm font-semibold transition bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
const removeClass = "favorite-toggle mt-4 rounded-md px-3 py-2 text-sm font-semibold transition bg-rose-100 text-rose-700 hover:bg-rose-200";
const refreshCount = () => updateFavoritesCount(favoritesCount, getFavorites().length);

// Add/remove favorite directly from a book card.
function toggleFavorite(event) {
  const button = event.target.closest(".favorite-toggle");
  if (!button) return;
  const book = readBookFromDataset(button);
  const removing = button.textContent.toLowerCase().includes("remove");

  if (removing) removeFavorite(book.key);
  else addFavorite(book);

  button.textContent = removing ? "Add Favorite" : "Remove Favorite";
  button.className = removing ? addClass : removeClass;
  setStatusMessage(statusMessage, `"${book.title}" ${removing ? "removed from" : "added to"} favorites.`, "success");
  refreshCount();
}

// Shared loader for initial books and search results.
async function showBooks(fetcher, emptyMsg, errorMsg, okMsg = "") {
  setStatusMessage(statusMessage, "");
  renderLoading(booksGrid);
  try {
    const books = await fetcher();
    if (!books.length) {
      booksGrid.innerHTML = "";
      setStatusMessage(statusMessage, emptyMsg);
      return "empty";
    }

    renderBooksGrid(booksGrid, books, { mode: "browse" });
    if (okMsg) setStatusMessage(statusMessage, okMsg, "success");
    return "ok";
  } catch (error) {
    booksGrid.innerHTML = "";
    setStatusMessage(statusMessage, error.message || errorMsg, "error");
    return "error";
  }
}

// Search by title from the Home page form.
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = (searchInput?.value || "").trim();
  if (!query) return;

  // Clear old browser validation message before new search.
  searchInput?.setCustomValidity("");
  const state = await showBooks(
    () => fetchBooksByTitle(query),
    "This title is not available in our library right now. Try another book.",
    "Something went wrong while fetching books.",
  );

  // Show a message attached to the search input when no result is found.
  if (state === "empty" && searchInput) {
    searchInput.setCustomValidity("This book is not available in our library right now. Try another title.");
    searchInput.reportValidity();
  }
});

// Remove search-bar validation message while user types.
searchInput?.addEventListener("input", () => searchInput.setCustomValidity(""));

booksGrid?.addEventListener("click", toggleFavorite);
refreshCount();
showBooks(() => fetchPopularAfricanBooks(), "No African popular books with covers found right now.", "Could not load African popular books.", "Showing books popular in Africa.");
