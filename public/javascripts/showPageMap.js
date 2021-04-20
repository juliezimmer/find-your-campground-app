
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 6 // starting zoom
});
 
// adds map pin
// call a new instance of mapboxgl with marker
new mapboxgl.Marker()
   .setLngLat(campground.geometry.coordinates)
   // method set on new Marker instance
   .setPopup(
      new mapboxgl.Popup({offset: 25})
         .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
         )
   )
   .addTo(map)
