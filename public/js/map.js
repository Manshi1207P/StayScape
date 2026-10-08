// mapData ({ token, title, coordinates }) is defined in views/listings/show.ejs
if (typeof mapboxgl !== "undefined" && mapData && mapData.token && mapData.coordinates) {
  mapboxgl.accessToken = mapData.token;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: mapData.coordinates, // [lng, lat]
    zoom: 7,
  });

  // Build the popup with DOM nodes (not HTML strings) so listing titles can't inject markup
  const popupContent = document.createElement("div");
  const heading = document.createElement("h4");
  heading.textContent = mapData.title;
  const note = document.createElement("p");
  note.textContent = "Exact location will be provided after booking";
  popupContent.append(heading, note);

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(mapData.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
    .addTo(map);
}
