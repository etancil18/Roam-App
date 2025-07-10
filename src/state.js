// src/state.js

let selectedPoints = [];
let currentRoute = null;
let allMarkers = [];

const markerCluster = L.markerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  maxClusterRadius: 40,
  disableClusteringAtZoom: 17
});

let enlargedMarkers = new Set();

function addMarker(marker) {
  allMarkers.push(marker);
}

function getAllMarkers() {
  return allMarkers;
}

function getSelectedPoints() {
  return selectedPoints;
}

function setSelectedPoints(points) {
  selectedPoints = points;
}

function getCurrentRoute() {
  return currentRoute;
}

function setCurrentRoute(route) {
  currentRoute = route;
}

function enlargeMarker(marker) {
  marker.setIcon(L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }));
  enlargedMarkers.add(marker);
}

function resetMarker(marker) {
  marker.setIcon(L.divIcon({
    className: 'custom-blue-icon',
    html: '',
    iconSize: [18, 18],
    iconAnchor: [9, 18]
  }));
  enlargedMarkers.delete(marker);
}

function resetAllEnlargedMarkers() {
  enlargedMarkers.forEach(m => resetMarker(m));
}

export {
  markerCluster,
  addMarker,
  getAllMarkers,
  getSelectedPoints,
  setSelectedPoints,
  getCurrentRoute,
  setCurrentRoute,
    selectedPoints,
  enlargeMarker,
  resetMarker,
  resetAllEnlargedMarkers
};
