// src/main.js

import './style.css';
import './map.js';
import { applyFilters } from './filters.js';
import { loadEventData } from './data.js';
import { generateRoute, clearRoute, removeLastPoint } from './routing.js';

import { getSelectedPoints } from './state.js';

const isSharedCrawl = new URLSearchParams(window.location.search).has('crawl');

function parseSharedCrawl() {
  // Placeholder – implement actual logic here if necessary.
}

document.addEventListener('DOMContentLoaded', () => {
  loadEventData(isSharedCrawl, parseSharedCrawl, getSelectedPoints(), window.markerCluster);

  document.getElementById('map-search').addEventListener('input', applyFilters);
  document.getElementById('vibeFilter').addEventListener('change', applyFilters);
  document.getElementById('priceFilter').addEventListener('change', applyFilters);

  document.getElementById('generateRoute').addEventListener('click', generateRoute);
  document.getElementById('removeLastPoint').addEventListener('click', removeLastPoint);
  document.getElementById('clearRoute').addEventListener('click', clearRoute);
});
