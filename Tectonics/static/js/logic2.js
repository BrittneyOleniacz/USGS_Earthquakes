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

//Make Map object with preset options
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

//this function determines the radius of the marker based on the magnitude.
function getRadius(magnitude) {
    // accomodate magnitudes of "0" to prevent erroneous markers.
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

d3.json(usgslink, function(data) {
    L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "<h1>Location: </h1>"+feature.properties.place 
                +"<br><h1>Magnitude: </h1>"+ feature.properties.mag
                +"<br><h1>Depth: </h1>"+feature.geometry.coordinates[2] + " km" 
            );
        }, 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000000",
                stroke: true,
                weight: 0.5,
            });
        }
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);


//Add Tectonic Plates as overlay
var Tplatelink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(Tplatelink, function(data) {
    L.geoJson(data, {
        color: "blue",
        weight: 2.25
    }).addTo(Tplates)
    Tplates.addTo(myMap)
// "A map is useless without a legend!" ~Mr. Stabp (9th grade World Studies Teacher)
    //Create a control object for the legend to be displayed on map
    var legend = L.control({
        position: "bottomright"
        });
    
        // Add the details displayed on the map to legend:
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        //magnitude intervals
        var grades = [-10, 10, 30, 50, 70, 90];
        //depth intervals
        var colors = [
                "#98EE00",
                "#d4EE00",
                "#EECC00",
                "#EE9C00",
                "#EA822C",
                "#EA2C2C"];
        // make forloop to pass preset intervals throught to generate a label with its colored square
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " 
            + colors[i] 
            + "'></i> "
            + grades[i] 
            + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
        };
        // Don't forget to actually add the legend to the map!
        legend.addTo(myMap);    
    //the END
    });
    
    

})