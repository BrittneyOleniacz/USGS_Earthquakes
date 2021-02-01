//Make Layer group for earthquakes
var earthquakes = new L.LayerGroup()

//Make Layer group for Tectonic plates
var Tplates = new L.LayerGroup()

//create map layers
//define tileLayer for later...
var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
})

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
});

var myMap = L.map("mapid", {
    center: [15, 0],
    zoom: 2.5
});

//Set tileLayer map as default
tileLayer.addTo(myMap);

var baseLayers = {
    "Default": tileLayer,
    "Light": light,
    "Dark": dark,
    "Satellite": satellite
};

var overlayMaps = {
    "Earthquakes" : earthquakes,
    "Plates": Tplates
    };

L.control.layers(baseLayers, overlayMaps).addTo(myMap);

//Add earthquake data as overlay 
var usgslink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function getColor(i) {
    return i > 90 ? "#EA2C2C" :
    i > 70 ? "#EA822C" :
    i > 50  ? "#EE9C00" :
    i > 30 ? "#EECC00" :
    i > 15  ?  "#D4EE00" :
          "#98EE00";
}

d3.json(usgslink, function(data) {
    L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h2> Magnitude: " + feature.properties.mag + "</h2><h2> Depth: " + feature.geometry.coordinates[2] + " km </h2> <hr> <h2> Location: " + feature.properties.place + "</h2>");
        }, 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: (feature.properties.mag)*4,
                fillColor: getColor(feature.geometry.coordinates[2]),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            });
        }
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);
})

//Add Tectonic Plates as overlay
var Tplatelink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(Tplatelink, function(data) {
    L.geoJson(data, {}).addTo(Tplates)
    Tplates.addTo(myMap)
})





