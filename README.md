# Mapping Seismic Activity

![USGSLogo](Images/1-Logo.png)

## Background
The United States Geological Survey, or USGS, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes. They collect a massive amount of data from all over the world each day, but lack a meaningful way of displaying it. Visualize the data to help better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.

- - -
## Objective
Visualize Earthquake occurrences and association with plate tectonics. 
- - -


## Methods
### Earthquake Occurences
#### 1. Get data
   Using JSON, Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page. The USGS provides earthquake data in a number of different formats, updated in 5 minute increments. 
   ```Ruby
   var usgslink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
   ```
#### 2. Import and Visualize the Data
   Using Leaflet, create a map that plots earthquakes using the longitude and latitude of the epicenters.
   * Data markers should reflect:
```Ruby
      d3.json(usgslink, function(data) {
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
 ```
    * magnitude of the earthquake by the size of the marker
 ```ruby
       function getRadius(magnitude) {
          if (magnitude === 0) {
            return 1;
           }
          return magnitude * 4;
        };
 ```
    * depth of the earthquake's focus by color of the marker
```ruby
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
 ```
    * Added Popups provide additional information about the earthquake when a marker is clicked.
 ```ruby
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
```
  
  
      * No map is complete without a legend!
```ruby  
    var legend = L.control({
    position: "bottomright"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
            "#98EE00",
            "#d4EE00",
            "#EECC00",
            "#EE9C00",
            "#EA822C",
            "#EA2C2C"
        ];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " 
        + colors[i] 
        + "'></i> "
        + grades[i] 
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
    legend.addTo(myMap);  
```
## Product
#### Default Base Map with Earthquake Overlay
![TectonicPlates_sat](Images/earthquakes.png)

### Tectonic Plates
#### 1. Get data
   Add additional data to illustrate relationship between tectonic plates and seismic activity. Data on tectonic plates can be found [here](https://github.com/fraxen/tectonicplates). 
#### 2. Import, add, and visualize the data
   Import additional data alongside original data so they appear on the same JS Leaflet map.
   * Add data to the original map with the following:
      * Plot the tectonic plates on the map
      * Add a number of options for the base map to choose.
      * seperate the two data sets into overlays that can be turned on and off independently.
      * Add layer controls to our map.

## Product
#### Default Base Map with Tectonic Plate Overlay
![TectonicPlates](Images/plates.png)

#### Default Base Map overlayed with Tectonic Plate and Earthquakes Layers
![TectonicPlates_default](Images/TectonicPlates_default.png)


## Additional Products
#### Satellite Base Map
![TectonicPlates_sat](Images/TectonicPlates_sat.png)

#### Dark Base Map
![TectonicPlates_dark](Images/TectonicPlates_dark.png)

#### Light Base Map
![TectonicPlates_light](Images/TectonicPlates_light.png)


## Observations
1. There is a strong relationship between tectonic plates and earthquake localities. 
2. Deeper earthquakes commonly occur in oceanic regions, while shallower earthquakes occur on continental crust. 
3. Moving inland, the earthquakes become smaller and shallower. This trend is likely exaplined by the cratonic region of the continental plates. The craton is the oldest and most tectonically stable area of a continental shield. 
4. Earthquakes occur among mountain ranges, such as the Cascade Mountains, Rockie Mountains and the Andes Mountains. 
   * However, no earthquakes are observed in the Himalayan Mountains, despite being along a convergent plate boundary, suggesting a convergent boudnary between two continental        plates are more tectonically stable. 
   * Additionally, earthquakes seldomly occur along the Blue Ridge range and the greater Applachian Mountains. These mountain ranges were formed nearly a billion years ago and        are significantly older than the Rockie Moutains that are dated at 50-80 million years old. This suggests, the age of a mountain ranges influences it's tectonic stability.
   * Lastly, the lithology of the underlying rock units in a mountain range should play a significant role in stability. 
5. Deeper earthquakes are located near at subduction zones, where one tectonic plate, is being submerged under another, as seen in the infographic below. Subduction commonly occurs between oceanic and continental plates due to a density defential. Oceanic Crust is basltic with a high iron content, while continental is felsic and having less dense mineralogy. Subduction zones can form deep sea trenches, such as the Mariana trench along the Mariana Island near Guam. It is along these subduction zones that the deepest, most extreme earthquakes originate. 
<p align="center">
  <img src="Images/subduction_infographic.png" alt="subduction_info" width="450" height="300"/>
</p>
6. The majority of earthquakes occur along the boundary of the Pacific Plate. This region is nicknamed, "Ring of Fire", is comprised of, almost entirely of subduction zones, as illustrated in the below map by Stegman in Schellart et al. (2011). When deep subductions adjust, an earthquake occurs and the displacement of water causes massive tsunamis.   
<p align="center">
  <img src="Images/subduction_zones.png" alt="subduction_zones"/>
</p>
7. Despite Hawaii being located near the center of the Pacific Plate, it experiences a significant number of Earthquakes for it's quaint surface area. While Hawaii is not located on tectonic plate boundaries, it is located above a volcanic hotspot. The volcanism in Hawaii is very active and can alone, be the source of earthquakes, but also, as volcanoes erupt, the magma chamber empties creating air pockets that collapse under the weight the earth's crust intitiating deep structiral adjustments. Most earthquakes in Hawaii go unnoticed, but in the most volcanically active region of "The Big Island", the depth of the focus is 30-36 Kilometers deep. 

#### Recommendations:
1. Data does not show earthquakes along Mid-Atlantic Ridge, a divergent plate boundary, despite there being thousands of transfrom boundaries perpendicular to the ridge. This may indicate a gap in data and where additional study should occur. 
2. To better correlate the focus of the earthquakes with the geologic features and surface characteristics, a map created with Light Detection and Ranging (LIDAR), both topograhic and bathymetric, remote sensing should be incorporated into this map. 
3. To better visualize the influence of tectonics has on natural disasters, more than earthquakes must be considered, such as volcanism, mountain building, tsunamis, and additionally, earthquakes caused by human inference of the earth's geological processes.
4. The direction and speed of the plates, much like Stegman's map above, should be incorporated into the map. 
5. Geologic age ranges of the continental crust, even subsurface bedrock lithology, should be overlayed to observe the relationship between age and tectonic stability. For instance, some of the oldest bedrock is found in the North American craton where there is a lack of tectonic activity. 


