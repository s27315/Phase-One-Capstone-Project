// Open Library endpoints.
const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_AFRICA_SUBJECT = "https://openlibrary.org/subjects/african_literature.json";
// Number of books to request by default.
const DEFAULT_LIMIT = 23;

// Build cover image URL from Open Library data.
function getCoverUrl(doc) {
  // First choice: cover id from API.
  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  }

  // Fallback: first ISBN if cover id is missing.
  let isbn = "";
  if (Array.isArray(doc.isbn) && doc.isbn.length) {
    isbn = doc.isbn[0];
  }

  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg`;
  }

  // No usable cover found.
  return "";
}

// Convert raw API item into app's book object shape.
function toBookModel(doc) {
  let author = "Unknown author";
  if (Array.isArray(doc.author_name) && doc.author_name.length) {
    author = doc.author_name[0];
  }

  return {
    key: doc.key || `fallback-${doc.title}-${doc.first_publish_year || "na"}`,
    title: doc.title || "Untitled",
    author,
    year: doc.first_publish_year || "N/A",
    coverUrl: getCoverUrl(doc),
  };
}

// Search books by title.
export async function fetchBooksByTitle(title, limit = DEFAULT_LIMIT) {
  // Avoid empty requests.
  const query = title.trim();
  if (!query) {
    return [];
  }

  // Build URL and call API.
  const url = `${OPEN_LIBRARY_SEARCH}?title=${encodeURIComponent(query)}&limit=${limit}`;
  const response = await fetch(url);

  // Throw readable error for the UI.
  if (!response.ok) {
    throw new Error("Failed to fetch books from Open Library.");
  }

  // Parse response safely.
  const data = await response.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];

  // Return only books that have cover images.
  return docs.map(toBookModel).filter((book) => book.coverUrl);
}

// Load default "popular African books" list for home page.
export async function fetchPopularAfricanBooks(limit = DEFAULT_LIMIT) {
  // Try search endpoint first (usually has better cover data).
  const searchUrl =
    `${OPEN_LIBRARY_SEARCH}?subject=${encodeURIComponent("african literature")}` +
    `&language=eng&has_fulltext=true&limit=${limit}`;
  const searchResponse = await fetch(searchUrl);

  if (searchResponse.ok) {
    const searchData = await searchResponse.json();
    const searchDocs = Array.isArray(searchData.docs) ? searchData.docs : [];

    // If we got results, return them immediately.
    if (searchDocs.length) {
      return searchDocs.map(toBookModel).filter((book) => book.coverUrl);
    }
  }

  // Fallback endpoint if first request fails/returns nothing.
  const subjectUrl = `${OPEN_LIBRARY_AFRICA_SUBJECT}?limit=${limit}&details=true`;
  const subjectResponse = await fetch(subjectUrl);

  if (!subjectResponse.ok) {
    throw new Error("Failed to fetch African popular books.");
  }

  const subjectData = await subjectResponse.json();
  const works = Array.isArray(subjectData.works) ? subjectData.works : [];

  // Convert fallback data to the same book shape.
  const books = works.map((work) => {
    let author = "Unknown author";
    if (Array.isArray(work.authors) && work.authors.length && work.authors[0].name) {
      author = work.authors[0].name;
    }

    return {
      key: work.key || `africa-${work.title || "untitled"}`,
      title: work.title || "Untitled",
      author,
      year: work.first_publish_year || "N/A",
      coverUrl: work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : "",
    };
  });

  // Return only items with covers.
  return books.filter((book) => book.coverUrl);
}
