<!-- Project summary and setup notes. -->
# Book Explorer - Frontend Phase 1 Capstone

<!-- High-level overview of the app. -->
Responsive, interactive, API-powered web app built with HTML, Tailwind CSS, and JavaScript modules.

<!-- Main capabilities shown in the project demo. -->
## Features
- Multi-page navigation: Home, Favorites, About
- Responsive layout (mobile, tablet, desktop)
- Search books by title (Open Library API)
- Default homepage feed focused on African literature
- Add/remove favorites
- Favorites persisted with localStorage
- Loading, success, error, and empty states

<!-- Tools and technologies used. -->
## Tech Stack
- HTML5
- Tailwind CSS (CDN)
- Custom CSS
- JavaScript (ES6 modules)
- Open Library API

<!-- File-by-file breakdown. -->
## Project Structure
- `index.html` - Home page
- `favorites.html` - Favorites page
- `about.html` - About page
- `style.css` - Shared styling and animations
- `js/main.js` - Home page logic
- `js/fetchBooks.js` - API fetch functions
- `js/favorites.js` - localStorage favorites module
- `js/favoritesPage.js` - Favorites page rendering/events
- `js/aboutPage.js` - Footer favorites count for About page
- `js/ui.js` - Shared UI rendering helpers

<!-- Quick setup steps for running locally. -->
## How to Run
1. Open the project folder in VS Code.
2. Start a local server (for example: Live Server extension).
3. Open `index.html` from that local server URL.

<!-- Checklist alignment with capstone requirements. -->
## Capstone Requirements Mapping
- Responsive multi-page layout: completed
- DOM interactivity and modules: completed
- Async API integration with search: completed
- Favorites with localStorage persistence: completed
- Navigation across Home/Favorites/About: completed

<!-- Important implementation notes for reviewers. -->
## Notes
- Book data and cover availability depend on Open Library.
- Results are currently filtered to books that have covers.
