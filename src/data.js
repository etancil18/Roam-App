// src/data.js

import { addMarker, getAllMarkers } from './state.js';
import { enlargeMarker } from './state.js';
import { showDetails } from './ui.js';

function loadEventData(isSharedCrawl, parseSharedCrawl, selectedPoints, markerCluster) {
  fetch('events.json')
    .then(res => res.json())
    .then(events => {
      events.forEach(ev => {
        const marker = L.marker([ev.lat, ev.lon]);
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
      });

      if (isSharedCrawl) {
        parseSharedCrawl();

        const sharedKeys = new Set(selectedPoints.map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`));
        getAllMarkers().forEach(marker => {
          const { lat, lng } = marker.getLatLng();
          const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
          if (sharedKeys.has(key)) {
            markerCluster.addLayer(marker);
          }
        });
      } else {
        getAllMarkers().forEach(marker => {
          markerCluster.addLayer(marker);
        });
      }
    });
}

export { loadEventData };
