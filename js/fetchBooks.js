const OPEN_LIBRARY_BASE = "https://openlibrary.org/search.json";
const DEFAULT_COVER = "assets/default-cover.svg";

function getCoverUrl(doc) {
  // Prefer Open Library's cover id, then ISBN fallback, then local default art.
  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  }

  const isbn = Array.isArray(doc.isbn) && doc.isbn.length ? doc.isbn[0] : "";
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg`;
  }

  return DEFAULT_COVER;
}

export async function fetchBooksByTitle(title, limit = 18) {
  const query = title.trim();
  if (!query) return [];

  const url = `${OPEN_LIBRARY_BASE}?title=${encodeURIComponent(query)}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch books from Open Library.");
  }

  const data = await response.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];

  return docs.map((doc) => ({
    key: doc.key || `fallback-${doc.title}-${doc.first_publish_year || "na"}`,
    title: doc.title || "Untitled",
    author: Array.isArray(doc.author_name) && doc.author_name.length ? doc.author_name[0] : "Unknown author",
    year: doc.first_publish_year || "N/A",
    coverUrl: getCoverUrl(doc),
  }));
}
