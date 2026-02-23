import { isFavorite } from "./favorites.js";

const DEFAULT_COVER = "assets/default-cover.svg";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function statusClassByType(type) {
  switch (type) {
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-white text-slate-700";
  }
}

export function setStatusMessage(container, message, type = "info") {
  if (!container) return;
  if (!message) {
    container.className = "mb-6 hidden rounded-lg border px-4 py-3 text-sm";
    container.textContent = "";
    return;
  }
  container.textContent = message;
  container.className = `mb-6 rounded-lg border px-4 py-3 text-sm ${statusClassByType(type)}`;
}

function createCard(book, { mode = "browse" } = {}) {
  const favorite = isFavorite(book.key);
  const actionLabel = mode === "favorites" ? "Remove" : favorite ? "Remove Favorite" : "Add Favorite";
  const actionClass = mode === "favorites" || favorite
    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
  const coverUrl = book.coverUrl || DEFAULT_COVER;

  const safeTitle = escapeHtml(book.title);
  const safeAuthor = escapeHtml(book.author);
  const safeYear = escapeHtml(book.year);
  const safeCover = escapeHtml(coverUrl);
  const safeKey = escapeHtml(encodeURIComponent(book.key));
  const safeEncodedYear = escapeHtml(encodeURIComponent(book.year));
  const safeFallbackCover = escapeHtml(DEFAULT_COVER);

  return `
    <article class="book-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <img
        class="book-cover"
        src="${safeCover}"
        alt="Cover for ${safeTitle}"
        loading="lazy"
        onerror="this.onerror=null;this.src='${safeFallbackCover}';"
      />
      <div class="mt-4 flex grow flex-col">
        <h3 class="text-lg font-bold leading-tight">${safeTitle}</h3>
        <p class="mt-2 text-sm text-slate-600">${safeAuthor}</p>
        <p class="mt-1 text-xs text-slate-500">First published: ${safeYear}</p>
        <button
          type="button"
          class="favorite-toggle mt-4 rounded-md px-3 py-2 text-sm font-semibold transition ${actionClass}"
          data-key="${safeKey}"
          data-title="${encodeURIComponent(book.title)}"
          data-author="${encodeURIComponent(book.author)}"
          data-year="${safeEncodedYear}"
          data-cover="${encodeURIComponent(coverUrl)}"
        >
          ${actionLabel}
        </button>
      </div>
    </article>
  `;
}

export function renderBooksGrid(grid, books, options = {}) {
  if (!grid) return;
  if (!books.length) {
    grid.innerHTML = "";
    return;
  }
  grid.innerHTML = books.map((book) => createCard(book, options)).join("");
}

export function renderLoading(grid) {
  if (!grid) return;
  grid.innerHTML = `
    <div class="col-span-full grid place-items-center rounded-xl border border-slate-200 bg-white p-8 text-slate-600">
      <div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-700"></div>
      <p class="mt-3 text-sm font-medium">Loading books...</p>
    </div>
  `;
}

export function updateFavoritesCount(el, count) {
  if (!el) return;
  el.textContent = `Favorites: ${count}`;
}

export function readBookFromDataset(button) {
  // Dataset values are encoded when rendering to keep attribute values safe.
  return {
    key: decodeURIComponent(button.dataset.key || ""),
    title: decodeURIComponent(button.dataset.title || ""),
    author: decodeURIComponent(button.dataset.author || ""),
    year: decodeURIComponent(button.dataset.year || "N/A"),
    coverUrl: decodeURIComponent(button.dataset.cover || ""),
  };
}
