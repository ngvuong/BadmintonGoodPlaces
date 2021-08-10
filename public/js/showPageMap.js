mapboxgl.accessToken =
  "pk.eyJ1Ijoibmd2dW9uZyIsImEiOiJja3M1ZDNrdmQwZnFoMzFzMzdwOG8yejBhIn0.mVbo1HGGs-dYEeU8iuS9Fg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
