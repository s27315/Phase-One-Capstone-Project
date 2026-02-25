// About page logic: keep footer favorites count updated.
import { getFavorites } from "./favorites.js";
import { updateFavoritesCount } from "./ui.js";

// Show current favorites count in footer.
const favoritesCount = document.getElementById("favoritesCount");
// Keep footer count consistent across all pages.
updateFavoritesCount(favoritesCount, getFavorites().length);
