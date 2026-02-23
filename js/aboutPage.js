import { getFavorites } from "./favorites.js";
import { updateFavoritesCount } from "./ui.js";

const favoritesCount = document.getElementById("favoritesCount");
// Keep footer count consistent across all pages.
updateFavoritesCount(favoritesCount, getFavorites().length);
