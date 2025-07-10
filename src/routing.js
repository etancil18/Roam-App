// src/routing.js

import { map } from './map.js';
import { setCurrentRoute, getSelectedPoints, setSelectedPoints, getAllMarkers } from './state.js';
import { enlargeMarker, resetAllEnlargedMarkers } from './ui.js';

let currentRoute = null;

function updateRoute() {
  const points = getSelectedPoints();
  if (currentRoute) map.removeControl(currentRoute);
  if (points.length >= 2) {
    currentRoute = L.Routing.control({
      waypoints: points,
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      createMarker: () => null
    }).addTo(map);
    setCurrentRoute(currentRoute);
  }
}

function addPointToRoute(latlng) {
  const points = getSelectedPoints();
  if (points.length >= 5) {
    alert('Maximum 5 points allowed. Clear or remove a point to add new.');
    return;
  }
  points.push(latlng);
  setSelectedPoints(points);
  updateRoute();
}

function removeLastPoint() {
  const points = getSelectedPoints();
  if (points.length === 0) {
    alert('No points to remove.');
    return;
  }
  points.pop();
  setSelectedPoints(points);
  updateRoute();
}

function clearRoute() {
  if (currentRoute) {
    map.removeControl(currentRoute);
    currentRoute = null;
  }
  setSelectedPoints([]);
}

function generateShareURL(points) {
  const base = window.location.origin + window.location.pathname;
  const params = points
    .map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`)
    .join('|');
  return `${base}?crawl=${encodeURIComponent(params)}`;
}

const neighborhoodCenters = {
  "alphabet city": [40.7265, -73.9815],
  "bedstuy": [40.6850, -73.9419],
  "bushwick": [40.6943, -73.9213],
  "chelsea": [40.7465, -74.0014],
  "chinatown": [40.7158, -73.9970],
  "clinton hill": [40.6896, -73.9606],
  "downtown brooklyn": [40.6928, -73.9903],
  "dumbo": [40.7033, -73.9881],
  "east village": [40.7260, -73.9816],
  "gramercy": [40.7376, -73.9857],
  "greenpoint": [40.7301, -73.9546],
  "greenwich village": [40.7336, -74.0027],
  "lower east side": [40.7150, -73.9843],
  "long island city": [40.7440, -73.9488],
  "midtown": [40.7549, -73.9840],
  "soho": [40.7233, -74.0030],
  "tribeca": [40.7163, -74.0086],
  "upper east side": [40.7736, -73.9566],
  "upper west side": [40.7870, -73.9754],
  "west village": [40.7359, -74.0036],
  "williamsburg": [40.7081, -73.9571]
};

function generateRoute() {
  const neighborhood = document.getElementById('neighborhood-input').value.toLowerCase();
  const crawlType = document.getElementById('durationFilter').value;
  const centerCoords = neighborhoodCenters[neighborhood];
  const allMarkers = getAllMarkers();

  if (!centerCoords) {
    alert("Please select a neighborhood.");
    return;
  }

  const center = L.latLng(centerCoords);
  let minDuration = 0, maxDuration = Infinity;
  if (crawlType === 'quick') maxDuration = 1.5;
  else if (crawlType === 'classic') { minDuration = 1.5; maxDuration = 3; }
  else if (crawlType === 'long') minDuration = 3;

  const candidates = allMarkers.filter(marker =>
    center.distanceTo(marker.getLatLng()) < 1500 &&
    marker.options.hours
  );

  let totalDuration = 0;
  const crawlPoints = [];

  for (let marker of candidates.sort(() => 0.5 - Math.random())) {
    const dur = marker.duration || 0;
    if (dur === 0 || crawlPoints.includes(marker)) continue;
    if (totalDuration + dur > maxDuration) break;
    totalDuration += dur;
    crawlPoints.push(marker);
    if (totalDuration >= minDuration) break;
  }

  if (crawlPoints.length < 2) {
    alert('Not enough places to build a crawl within this duration.');
    return;
  }

  resetAllEnlargedMarkers();
  const latlngs = crawlPoints.map(m => m.getLatLng());
  latlngs.forEach(latlng => enlargeMarker(crawlPoints.find(m => m.getLatLng().equals(latlng))));

  setSelectedPoints(latlngs);
  updateRoute();
  map.fitBounds(L.featureGroup(crawlPoints).getBounds());
}

export {
  updateRoute,
  addPointToRoute,
  removeLastPoint,
  clearRoute,
  generateRoute,
  generateShareURL
};
