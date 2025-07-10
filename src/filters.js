// src/filters.js

import { markerCluster } from './state.js';
import { getAllMarkers } from './state.js';

const vibeMap = {
  jazz: ["jazz"],
  artsy: ["art", "artsy", "gallery", "museum"],
  coffee: ["coffee", "café", "matcha"],
  hip: ["hip", "trendy", "dj", "brunch"],
  "date night": ["date", "intimate", "date night", "charming"],
  nightlife: ["nightlife", "dance", "social", "dj", "speakeasy"],
  "hidden gem": ["hidden", "hidden gem", "speakeasy", "underground"],
  wine: ["wine", "natural wine", "craft wine"],
  rooftop: ["rooftop", "scenic", "views", "skyline"]
};

function applyFilters() {
  const vibe = document.getElementById('vibeFilter').value.toLowerCase();
  const query = document.getElementById('map-search').value.toLowerCase();
  const price = document.getElementById('priceFilter').value.trim();

  const allMarkers = getAllMarkers();
  markerCluster.clearLayers();

  allMarkers.forEach(marker => {
    let vibeMatch = !vibe;
    if (vibe && vibeMap[vibe]) {
      vibeMatch = vibeMap[vibe].some(keyword => marker.vibe.includes(keyword));
    }
    const searchMatch = !query || marker.name.includes(query) || marker.vibe.includes(query);
    const markerPrice = marker.price ? marker.price.trim() : '';
    const priceMatch = !price || markerPrice === price;

    if (vibeMatch && searchMatch && priceMatch) {
      markerCluster.addLayer(marker);
    }
  });
}

export { applyFilters };
