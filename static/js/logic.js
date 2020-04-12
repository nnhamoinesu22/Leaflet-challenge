// Store our API endpoint inside queryurl
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query url
d3.json(queryurl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});



function createFeatures(earthquakedata) {

  // Define streetmap amd darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var circlearray = new Array();

  // Loop through the cities array and create one marker for each earthquake object
  for (var i = 0; i < earthquakedata.length; i++) {

    coordinates = [earthquakedata[i].geometry.coordinates[1],earthquakedata[i].geometry.coordinates[0]]
    properties = earthquakedata[i].properties;

    var color = "#d7191c";
    if (properties.mag < 1) {
      color = "#00ccbc";
    }
    else if (properties.mag < 2) {
      color = "#90eb9d";
    }
    else if (properties.mag < 3) {
      color = "#f9d057";
    }
    else if (properties.mag < 4) {
      color = "#f29e2e";
    }
    else if (properties.mag < 5) {
      color = "#e76818";
    }

    
    // Add circles to map
    var myCircle = L.circle(coordinates, {
        fillOpacity: 0.75,
        // color: "red",
        // fillColor: "red",
        // // Adjust radius
        // radius: (10 * 15000)
        color: color,
        fillColor: color,
        // Adjust radius
        radius: (properties.mag * 15000)
      }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag + "</h3>");
      //Add the cricle to the array
      circlearray.push(myCircle);
    }

    //Create the layer for the circles
    var earthquakes = L.layerGroup(circlearray);
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Add the layer to the map
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap,earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps,overlayMaps, {
       collapsed: false
    }).addTo(myMap);
}