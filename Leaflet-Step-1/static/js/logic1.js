//Make map and starting position
var myMap = L.map("mapid", {
    center: [15, 0],
    zoom: 2.5
});

//create map layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap)

var usgslink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function getColor(i) {
    return i > 90 ? "#EA2C2C" :
    i > 70 ? "#EA822C" :
    i > 50  ? "#EE9C00" :
    i > 30 ? "#EECC00" :
    i > 10  ?  "#D4EE00" :
             "#98EE00";
  }

d3.json(usgslink, function (data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        //"On each data point, popup will appear when clicked to display, location, mag, and depth"
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h2> Magnitude: " + feature.properties.mag + "</h2><h2> Depth: " + feature.geometry.coordinates[2] + " km </h2> <hr> <h2> Location: " + feature.properties.place + "</h2>");
        }, 
        //"each data point will be represented by a circle where the radius is representing the mag and the color depth."
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: (feature.properties.mag)*4,
                fillColor: getColor(feature.geometry.coordinates[2]),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(myMap);
})
