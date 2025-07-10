// src/map.js

import { updateRoute, generateShareURL } from './routing.js';
import { showDetails, enlargeMarker, resetAllEnlargedMarkers } from './ui.js';
import { selectedPoints, setCurrentRoute, addMarker, getAllMarkers, markerCluster } from './state.js';

const map = L.map('map').setView([40.72, -73.98], 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & Carto',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

const defaultIcon = L.divIcon({
  className: 'custom-blue-icon',
  html: '',
  iconSize: [18, 18],
  iconAnchor: [9, 18]
});

const enlargedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const isSharedCrawl = new URLSearchParams(window.location.search).has('crawl');

const neighborhoodCenters = {
  "alphabet city": L.latLng(40.7265, -73.9815),
  "bedstuy": L.latLng(40.6850, -73.9419),
  "bushwick": L.latLng(40.6943, -73.9213),
  "chelsea": L.latLng(40.7465, -74.0014),
  "chinatown": L.latLng(40.7158, -73.9970),
  "clinton hill": L.latLng(40.6896, -73.9606),
  "downtown brooklyn": L.latLng(40.6928, -73.9903),
  "dumbo": L.latLng(40.7033, -73.9881),
  "east village": L.latLng(40.7260, -73.9816),
  "gramercy": L.latLng(40.7376, -73.9857),
  "greenpoint": L.latLng(40.7301, -73.9546),
  "greenwich village": L.latLng(40.7336, -74.0027),
  "lower east side": L.latLng(40.7150, -73.9843),
  "long island city": L.latLng(40.7440, -73.9488),
  "midtown": L.latLng(40.7549, -73.9840),
  "soho": L.latLng(40.7233, -74.0030),
  "tribeca": L.latLng(40.7163, -74.0086),
  "upper east side": L.latLng(40.7736, -73.9566),
  "upper west side": L.latLng(40.7870, -73.9754),
  "west village": L.latLng(40.7359, -74.0036),
  "williamsburg": L.latLng(40.7081, -73.9571)
};

fetch('events.json')
  .then(res => res.json())
  .then(events => {
    events.forEach(ev => {
      const marker = L.marker([ev.lat, ev.lon], { icon: defaultIcon });
      marker.vibe = ev.vibe.toLowerCase();
      marker.name = ev.name.toLowerCase();
      marker.price = ev.price;
      marker.duration = ev.duration || 0;
      marker.options.link = ev.link;
      marker.options.hours = ev.hours || [];

      marker.on('click', () => {
        resetAllEnlargedMarkers();
        enlargeMarker(marker);
        showDetails(ev, marker.getLatLng());
      });

      addMarker(marker);
      markerCluster.addLayer(marker);
    });
  });

export { map, markerCluster, defaultIcon, enlargedIcon, neighborhoodCenters };