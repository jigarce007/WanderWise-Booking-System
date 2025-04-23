import * as turf from '@turf/turf';
export const displayMap = (locations) => {
  // 1. Convert coordinates to Turf points
  const turfPoints = locations.map((loc) => turf.point(loc.coordinates));
  const featureCollection = turf.featureCollection(turfPoints);

  // 2. Get the center of all points
  const centerPoint = turf.center(featureCollection);
  const centerCoords = centerPoint.geometry.coordinates;

  // 3. Calculate max distance from center to each point (in kilometers)
  let maxDistance = 0;
  turfPoints.forEach((point) => {
    const dist = turf.distance(centerCoords, point.geometry.coordinates, {
      units: 'kilometers',
    });
    if (dist > maxDistance) maxDistance = dist;
  });

  // 4. Add buffer around max distance so circle fully covers all pins
  const circleRadius = maxDistance + 20; // Add 2 km padding

  // 5. Create circle polygon
  const circle = turf.circle(centerCoords, circleRadius, {
    steps: 64,
    units: 'kilometers',
  });

  // 6. Setup map
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: centerCoords,
    zoom: 4,
    scrollZoom: false,
  });
  // Add controls
  map.addControl(new mapboxgl.NavigationControl());

  map.on('load', () => {
    // Fit map to circle bounds
    const bounds = turf.bbox(circle);
    map.fitBounds(bounds, { padding: 60 });

    // Add circle to map
    map.addSource('geofence-circle', {
      type: 'geojson',
      data: circle,
    });

    map.addLayer({
      id: 'geofence-circle-layer',
      type: 'fill',
      source: 'geofence-circle',
      paint: {
        'fill-color': '#1E90FF',
        'fill-opacity': 0.2, // 20% transparency
      },
    });

    // Add markers
    locations.forEach((loc) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(loc.description);

      const marker = new mapboxgl.Marker()
        .setLngLat(loc.coordinates)
        .setPopup(popup)
        .addTo(map);

      // ✅ Open popup immediately on map load
      marker.togglePopup();
    });
  });
};
