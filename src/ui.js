// src/ui.js

import { addPointToRoute, generateShareURL, updateRoute } from './routing.js';
import { resetAllEnlargedMarkers, enlargeMarker, resetMarker } from './state.js';
import { getSelectedPoints, getAllMarkers } from './state.js';

function showDetails(ev, latlng) {
  const details = document.getElementById('details');
  const suggestions = findNearbySimilar(latlng, (ev.vibe || '').toLowerCase(), 350);

  let suggestionHtml = suggestions.length > 0
    ? `<strong>Also could be the move:</strong><ul>${suggestions.map(s => `<li>${s.name}</li>`).join('')}</ul>`
    : '<em>No similar spots nearby</em>';

  const todayHours = ev.hours ? getTodayHours(ev.hours) : "No hours available";
  const isOpen = isOpenNow(ev.hours || []);
  const statusText = isOpen ? "🟢 Open Now" : "🔴 Closed Now";

  const shareLink = generateShareURL(getSelectedPoints());

  details.innerHTML = `
    <strong>${ev.name}</strong><br>
    Vibe: ${ev.vibe}<br>
    Price: ${ev.price || "N/A"}<br>
    Status: ${statusText}<br>
    Today's Hours: ${todayHours}<br>
    <a href="${ev.link}" target="_blank">View More</a><br>
    <button id="addToRoute">Add to Route</button>
    <button id="exportGooglePopup">Export Route to Google Maps</button>
    <button id="closeDetails">Close</button>
    <hr>
    ${suggestionHtml}
  `;

  details.style.display = 'block';

  document.getElementById('addToRoute').addEventListener('click', () => {
    addPointToRoute(latlng);
  });

  document.getElementById('exportGooglePopup').addEventListener('click', () => {
    const points = getSelectedPoints();
    if (points.length < 2) {
      alert('Select at least 2 points to export a route.');
      return;
    }
    const base = "https://www.google.com/maps/dir/";
    const path = points.map(p => `${p.lat},${p.lng}`).join('/');
    window.open(base + path, '_blank');
  });

  document.getElementById('closeDetails').addEventListener('click', () => {
    details.style.display = 'none';
  });
}

function getTodayHours(hoursArray) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  const todayEntry = hoursArray.find(entry => entry.startsWith(today));
  return todayEntry || "Hours not available";
}

function isOpenNow(hoursArray) {
  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = dayNames[now.getDay()];
  const todayHoursEntry = hoursArray.find(h => h.toUpperCase().startsWith(today.toUpperCase()));
  if (!todayHoursEntry) return false;

  const cleanHours = todayHoursEntry.replace(/[–—−]/g, "-").replace(/[\u202F\u00A0]/g, " ");
  const match = cleanHours.match(/(\d{1,2}(?::\d{2})?\s*[APMapm]{2})\s*-\s*(\d{1,2}(?::\d{2})?\s*[APMapm]{2})/);
  if (!match) return false;

  const [_, openStr, closeStr] = match;
  const open = new Date(`${now.toDateString()} ${openStr}`);
  let close = new Date(`${now.toDateString()} ${closeStr}`);
  if (close <= open) close.setDate(close.getDate() + 1);

  return now >= open && now <= close;
}

function findNearbySimilar(latlng, vibeText = '', radius = 350) {
  const tags = vibeText.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  const allMarkers = getAllMarkers();
  return allMarkers.filter(marker => {
    const markerVibe = (marker.vibe || '').toLowerCase();
    const distance = latlng.distanceTo(marker.getLatLng());
    const vibeMatch = tags.length > 0 ? tags.some(tag => markerVibe.includes(tag)) : markerVibe.includes(vibeText);
    return distance <= radius && vibeMatch && !latlng.equals(marker.getLatLng());
  }).slice(0, 3);
}

export { showDetails, getTodayHours, isOpenNow };