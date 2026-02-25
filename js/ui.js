// Shared UI helpers for messages, cards, and counters.
import { isFavorite } from "./favorites.js";

// Reused status classes.
const STATUS_BASE = "mb-6 rounded-lg border px-4 py-3 text-sm";
const STATUS_HIDDEN = "mb-6 hidden rounded-lg border px-4 py-3 text-sm";

// Escape user/API text before inserting into HTML.
function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function setStatusMessage(el, msg, type = "info") {
  if (!el) return;

  if (!msg) {
    el.className = STATUS_HIDDEN;
    el.textContent = "";
    return;
  }

  const statusClass =
    type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-white text-slate-700";

  el.textContent = msg;
  el.className = `${STATUS_BASE} ${statusClass}`;
}

// Build one book card as HTML string.
function card(book, mode = "browse") {
  const favorite = isFavorite(book.key);
  const action = mode === "favorites" ? "Remove" : favorite ? "Remove Favorite" : "Add Favorite";
  const btnClass =
    mode === "favorites" || favorite
      ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
  const title = book.title || "Untitled";
  const author = book.author || "Unknown author";
  const year = String(book.year || "N/A");
  const cover = book.coverUrl || "";
  const key = encodeURIComponent(book.key || "");

  return `
    <article class="book-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <img class="book-cover" src="${esc(cover)}" alt="Cover for ${esc(title)}" loading="lazy" onerror="this.closest('article')?.remove()" />
      <div class="mt-4 flex grow flex-col">
        <h3 class="text-lg font-bold leading-tight">${esc(title)}</h3>
        <p class="mt-2 text-sm text-slate-600">${esc(author)}</p>
        <p class="mt-1 text-xs text-slate-500">First published: ${esc(year)}</p>
        <button type="button" class="favorite-toggle mt-4 rounded-md px-3 py-2 text-sm font-semibold transition ${btnClass}"
          data-key="${key}" data-title="${encodeURIComponent(title)}" data-author="${encodeURIComponent(author)}"
          data-year="${encodeURIComponent(year)}" data-cover="${encodeURIComponent(cover)}">${action}</button>
      </div>
    </article>`;
}

export function renderBooksGrid(grid, books, options = {}) {
  if (!grid) return;
  if (!books.length) return (grid.innerHTML = "");
  grid.innerHTML = books.map((b) => card(b, options.mode)).join("");
}

// Show loading state while waiting for API response.
export function renderLoading(grid) {
  if (!grid) return;
  grid.innerHTML = `<div class="col-span-full grid place-items-center rounded-xl border border-slate-200 bg-white p-8 text-slate-600"><div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-700"></div><p class="mt-3 text-sm font-medium">Loading books...</p></div>`;
}

// Update footer favorite count.
export function updateFavoritesCount(el, count) {
  if (!el) return;
  el.textContent = `Favorites: ${count}`;
}

// Convert button dataset attributes back into a book object.
export function readBookFromDataset(btn) {
  return {
    key: decodeURIComponent(btn.dataset.key || ""),
    title: decodeURIComponent(btn.dataset.title || ""),
    author: decodeURIComponent(btn.dataset.author || ""),
    year: decodeURIComponent(btn.dataset.year || "N/A"),
    coverUrl: decodeURIComponent(btn.dataset.cover || ""),
  };
}
