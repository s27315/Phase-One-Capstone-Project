const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_AFRICA_SUBJECT = "https://openlibrary.org/subjects/african_literature.json";
const DEFAULT_LIMIT = 23;

function getCoverUrl(doc) {
  // Prefer Open Library's cover id, then ISBN fallback.
  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  }

  const isbn = Array.isArray(doc.isbn) && doc.isbn.length ? doc.isbn[0] : "";
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg`;
  }

  return "";
}

function toBookModel(doc) {
  return {
    key: doc.key || `fallback-${doc.title}-${doc.first_publish_year || "na"}`,
    title: doc.title || "Untitled",
    author: Array.isArray(doc.author_name) && doc.author_name.length ? doc.author_name[0] : "Unknown author",
    year: doc.first_publish_year || "N/A",
    coverUrl: getCoverUrl(doc),
  };
}

export async function fetchBooksByTitle(title, limit = DEFAULT_LIMIT) {
  const query = title.trim();
  if (!query) return [];

  const url = `${OPEN_LIBRARY_SEARCH}?title=${encodeURIComponent(query)}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch books from Open Library.");
  }

  const data = await response.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];

  return docs.map(toBookModel).filter((book) => book.coverUrl);
}

export async function fetchPopularAfricanBooks(limit = DEFAULT_LIMIT) {
  // Prefer the search endpoint for better cover metadata (cover_i + isbn).
  const searchUrl =
    `${OPEN_LIBRARY_SEARCH}?subject=${encodeURIComponent("african literature")}` +
    `&language=eng&has_fulltext=true&limit=${limit}`;
  const searchResponse = await fetch(searchUrl);
  if (searchResponse.ok) {
    const searchData = await searchResponse.json();
    const searchDocs = Array.isArray(searchData.docs) ? searchData.docs : [];
    if (searchDocs.length) {
      return searchDocs.map(toBookModel).filter((book) => book.coverUrl);
    }
  }

  // Fallback to subject works endpoint if search is unavailable.
  const subjectUrl = `${OPEN_LIBRARY_AFRICA_SUBJECT}?limit=${limit}&details=true`;
  const subjectResponse = await fetch(subjectUrl);
  if (!subjectResponse.ok) {
    throw new Error("Failed to fetch African popular books.");
  }
  const subjectData = await subjectResponse.json();
  const works = Array.isArray(subjectData.works) ? subjectData.works : [];

  return works.map((work) => ({
    key: work.key || `africa-${work.title || "untitled"}`,
    title: work.title || "Untitled",
    author: Array.isArray(work.authors) && work.authors.length ? work.authors[0].name || "Unknown author" : "Unknown author",
    year: work.first_publish_year || "N/A",
    coverUrl: work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : "",
  })).filter((book) => book.coverUrl);
}
