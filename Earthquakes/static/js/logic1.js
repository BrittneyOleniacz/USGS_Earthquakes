// Make map and starting position
var myMap = L.map("mapid", {
    center: [15, 0],
    zoom: 2.5
});

// Create default layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap)

// Create variable for earthquake geoJSON data, not neccessary, but prefered.
var usgslink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// This section, essentially uses D3 to call the data and set how it'll be used.
d3.json(usgslink, function(data) {
// Each earthquake should be displayed on the map as markers.
// The size and color of the markers are determined by the magnitude and depth of each earthquake. 
    // This function sets the style of the markers for each of the earthquakes. 
    function styleInfo(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            stroke: true,
            weight: 0.5,
        };
    }
    // This function uses the depth of the earthquake to determine the color of the markers. 
    // The depth is filterd to its "case" and returns the given color
    function getColor(depth) {
        switch (true) {
        case depth > 90:
            return "#EA2C2C";
        case depth > 70:
            return "#EA822C";
        case depth > 50:
            return "#EE9C00";
        case depth > 30:
            return "#EECC00";
        case depth > 10:
            return "#D4EE00";
        default:
            return "#98EE00";
        };
    }
    //this function determines the radius of the marker based on the magnitude.
    function getRadius(magnitude) {
        // accomodate magnitudes of "0" to prevent erroneous markers.
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }
    // Creat a geoJSON layer to the map to display the retrieved and styled data 
    L.geoJson(data, {
        // Make each feature a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        // Create a popup to display the location, mag, and depth to appear when marker is clicked. 
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h1>Location: </h1>"+feature.properties.place 
                +"<br><h1>Magnitude: </h1>"+ feature.properties.mag
                +"<br><h1>Depth: </h1>"+feature.geometry.coordinates[2] + " km" 
            );
        },
    }).addTo(myMap);

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
            "#EA2C2C"
        ];
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

