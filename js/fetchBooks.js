// Fetch and map book data from Open Library.
const SEARCH_URL = "https://openlibrary.org/search.json";
const LIMIT = 23;

// Build cover image URL from Open Library response.
function getCoverUrl(doc = {}) {
  if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  if (doc.isbn?.[0]) {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(doc.isbn[0])}-M.jpg`;
  }
  return "";
}

// Keep only the fields the UI needs.
function mapBook(doc = {}) {
  return {
    key: doc.key || `book-${doc.title || "untitled"}-${doc.first_publish_year || "na"}`,
    title: doc.title || "Untitled",
    author: doc.author_name?.[0] || "Unknown author",
    year: doc.first_publish_year || "N/A",
    coverUrl: getCoverUrl(doc),
  };
}

// Fetch search documents and normalize to array.
async function fetchDocs(url, errorMessage) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(errorMessage);
  const data = await res.json();
  return Array.isArray(data.docs) ? data.docs : [];
}

// Search books by title.
export async function fetchBooksByTitle(title, limit = LIMIT) {
  const query = title.trim();
  if (!query) return [];

  const docs = await fetchDocs(
    `${SEARCH_URL}?title=${encodeURIComponent(query)}&limit=${limit}`,
    "Failed to fetch books from Open Library.",
  );
  return docs.map(mapBook).filter((book) => book.coverUrl);
}

// Load default African literature books for the home page.
export async function fetchPopularAfricanBooks(limit = LIMIT) {
  const docs = await fetchDocs(
    `${SEARCH_URL}?subject=${encodeURIComponent("african literature")}&limit=${limit}`,
    "Failed to fetch African popular books.",
  );
  return docs.map(mapBook).filter((book) => book.coverUrl);
}
