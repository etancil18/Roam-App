// src/routing.js

import { map } from './map.js';
import { setCurrentRoute, getSelectedPoints, setSelectedPoints } from './state.js';

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
  const current = setCurrentRoute(null);
  if (current) map.removeControl(current);
  setSelectedPoints([]);
}

function generateShareURL(points) {
  const base = window.location.origin + window.location.pathname;
  const params = points
    .map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`)
    .join('|');
  return `${base}?crawl=${encodeURIComponent(params)}`;
}

export { updateRoute, addPointToRoute, removeLastPoint, clearRoute, generateShareURL };