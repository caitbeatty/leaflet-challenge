// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";


//create markers reflect the magnitude of the earthquake by their size and depth of the earth quake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});



function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
//make circles on the map and add colors and radius 
//-10 to 10 is green, 10 to 30 is yellow, 30 to 50 is orange, 50 to 70 is dark orange, 70 to 90 is red orange, 90 + is red
  function pointToLayer(feature, latlng) {
    
    var mag = feature.properties.mag;

    var depth = feature.geometry.coordinates[2]; 

    var color = "";
    if (depth <= 10) {
    color = "green";
    }
    else if (depth <= 30) {
    color = "yellow";
    }
    else if (depth <= 50) {
    color = "orange";
    }
    else if (depth <= 70) {
      color = "darkorange";
      }
    else if (depth <= 90) {
        color = "orangered";
        }  
    else {
    color = "red";
    }
    
    return new L.CircleMarker(latlng,
      {radius: mag * 2,
        color: color
      });
    }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  // });

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
  });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });



  // // Define a baseMaps object to hold our base layers
  // var baseMaps = {
  //   "Street Map": streetmap
  // };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  

  // adding a legend and telling it where to go
    var legend = L.control({position: "bottomright"});
  
    // information inside legend 
     legend.onAdd = function(myMap) {
       var div = L.DomUtil.create("div", "info legend");
  
       // loop through our density intervals and generate a label with a colored square for each interval
       var dlabel = [-10, 10, 30, 50, 70, 90]
       var colors = [
         "#008000",
         "#FFFF00",
         "#FFA500",
         "#FF8C00",
         "#FF4500",
         "#FF0000"
       ];
  
       // Looping through 
       for (var i = 0; i < dlabel.length; i++) {
        //  div.innerHTML +=
        //    "<i style='background: " + colors[i] + "'></i> " + dlabel[i] + "<br>";

          div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            dlabel[i] + (dlabel[i + 1] ? '&ndash;' + dlabel[i + 1] + '<br>' : '+');
       }
       return div;
     };
  
    // Finally, we our legend to the map.
     legend.addTo(myMap);

  

  
// Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}