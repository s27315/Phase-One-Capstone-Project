import { isFavorite } from "./favorites.js";

// Small helper to escape text before putting it in HTML.
function h(value = "") {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (ch) => map[ch]);
}

// Show message box (or hide it when message is empty).
export function setStatusMessage(container, message, type = "info") {
  if (!container) return;
  if (!message) {
    container.className = "mb-6 hidden rounded-lg border px-4 py-3 text-sm";
    container.textContent = "";
    return;
  }

  const styleByType = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-slate-200 bg-white text-slate-700",
  };
  container.textContent = message;
  container.className = `mb-6 rounded-lg border px-4 py-3 text-sm ${styleByType[type] || styleByType.info}`;
}

function card(book, mode = "browse") {
  const cover = book.coverUrl || "";
  const favorite = isFavorite(book.key);
  const removeMode = mode === "favorites" || favorite;
  const label = mode === "favorites" ? "Remove" : removeMode ? "Remove Favorite" : "Add Favorite";
  const btnClass = removeMode
    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";

  return `<article class="book-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
    <img class="book-cover" src="${h(cover)}" alt="Cover for ${h(book.title)}" loading="lazy" onerror="this.closest('article').remove()" />
    <div class="mt-4 flex grow flex-col">
      <h3 class="text-lg font-bold leading-tight">${h(book.title)}</h3>
      <p class="mt-2 text-sm text-slate-600">${h(book.author)}</p>
      <p class="mt-1 text-xs text-slate-500">First published: ${h(book.year)}</p>
      <button type="button" class="favorite-toggle mt-4 rounded-md px-3 py-2 text-sm font-semibold transition ${btnClass}"
        data-key="${encodeURIComponent(book.key)}"
        data-title="${encodeURIComponent(book.title)}"
        data-author="${encodeURIComponent(book.author)}"
        data-year="${encodeURIComponent(book.year)}"
        data-cover="${encodeURIComponent(cover)}">${label}</button>
    </div>
  </article>`;
}

// Render books in a grid.
export function renderBooksGrid(grid, books, options = {}) {
  if (!grid) return;
  if (!books.length) {
    grid.innerHTML = "";
    return;
  }
  const mode = options.mode || "browse";
  grid.innerHTML = books.map((book) => card(book, mode)).join("");
}

// Show loading box.
export function renderLoading(grid) {
  if (!grid) return;
  grid.innerHTML = `<div class="col-span-full grid place-items-center rounded-xl border border-slate-200 bg-white p-8 text-slate-600">
    <div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-700"></div>
    <p class="mt-3 text-sm font-medium">Loading books...</p>
  </div>`;
}

// Update favorites label.
export function updateFavoritesCount(el, count) {
  if (!el) return;
  el.textContent = `Favorites: ${count}`;
}

// Convert button data back to book object.
export function readBookFromDataset(button) {
  return {
    key: decodeURIComponent(button.dataset.key || ""),
    title: decodeURIComponent(button.dataset.title || ""),
    author: decodeURIComponent(button.dataset.author || ""),
    year: decodeURIComponent(button.dataset.year || "N/A"),
    coverUrl: decodeURIComponent(button.dataset.cover || ""),
  };
}
