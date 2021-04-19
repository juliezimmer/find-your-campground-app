
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 6 // starting zoom
});
 
// adds map pin
// call a new instance of mapboxgl with marker
new mapboxgl.Marker()
   .setLngLat(campground.geometry.coordinates)
   .addTo(map)
