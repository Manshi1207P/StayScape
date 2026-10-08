const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

let client = null;

// Returns a GeoJSON Point for a place name, or undefined if it can't be found
// (or MAP_TOKEN is missing). The app keeps working without a map in that case.
module.exports = async function geocode(query) {
  if (!query) return undefined;
  if (!client) {
    if (!process.env.MAP_TOKEN) return undefined;
    client = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });
  }
  try {
    const response = await client.forwardGeocode({ query, limit: 1 }).send();
    const feature = response.body.features[0];
    return feature ? feature.geometry : undefined;
  } catch (err) {
    console.log("Geocoding failed:", err.message);
    return undefined;
  }
};
