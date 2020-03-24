// Adding base tile layer to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Assemble API query URL from flask
var url = "https://api.openchargemap.io/v3/poi/?output=json&countrycode=CA&maxresults=100000&includecomments=true&verbose=true&opendata=true&client=ev-charging-stations&key=f6e470b3-c2f2-4c69-a477-3dbac08fea4b";
//var url = "mongodb://heroku_kmpx4htl:388nghofnub05u3dgf17qgf8lb@ds045588.mlab.com:45588/heroku_kmpx4htl?retryWrites=false"

// Store the response in a variable
var data = d3.json(url);

// get all the connector types and add them into the layer group layers
data.then(function(response) {

  //console.log(response);
  // make a js object that stores the connector types and the number of each
  var types = {};
  var overlaysDict = {};

  response.forEach(function(location){
    var lis = location.Connections
    
    for (i=0; i<lis.length; i++) {
      var type = lis[i].ConnectionType.Title
        //console.log(type)
      if (type in types){
          types[type] = types[type]+1;
      }
      else {
          types[type] = 1;
      }
    } 
  })
  //console.log(types)
  // Get only the distinct connector types from the object
  
  var list_types = Object.keys(types);
    
   console.log(list_types);
  // Add each type to layers group
  for (var CT in list_types) {
    // console.log(list_types[CT]);
    overlaysDict[list_types[CT]] = new L.LayerGroup();
  };
   console.log(overlaysDict);
  // console.log("finished!")

  // return overlaysDict
  // Creating map object when this page is open in the browser
  var myMap = L.map("map", {
    center: [56.1304, -106.3468],
    zoom:4.4,
    layers : Object.values(overlaysDict)
  });

  // Add our 'streetmap' tile layer to the map
  streetmap.addTo(myMap);
  console.log(Object.values(overlaysDict))

  // Show overlayes
  console.log(overlaysDict)

  // Create a control for our layers, add our overlay layers to it
  L.control.layers(null, overlaysDict).addTo(myMap);

  for (var i = 0; i < response.length; i++) {
  
    // Set the data location property to a variable
    var location = response[i].AddressInfo;
    var direction = '<button id="direction" type="button">Get Direction</button>'
    var detail = '<button id="detail" type="button">More Info</button>'
    var link = "https://www.google.com/maps/dir/" +  location.AddressLine1;

    var connectionType = response[i].Connections;
    for (i in Object.keys(overlaysDict)) {
      connectionType.forEach(type => {
        if (type.ConnectionType.Title === Object.keys(overlaysDict)[i]) {
          
        }
      var newMarker = L.marker([location.Latitude, location.Longitude]);
      newMarker.addTo(overlaysDict[Object.keys(overlaysDict)[i]]);
      newMarker.bindPopup("<h3>"+response[i].AddressInfo.Title+"</h3><hr><p>"+"ConnectionType: "+ response[i].Connections[0].ConnectionType.Title + "</p> <p> Power Level: " + response[i].Connections[0].Level.Title + '</p><a href="' + link + '  target="_blank">' + direction + "</a><br>" +detail);
      })
    }

    // if (
    // response[i].Connections.length > 0
    // && response[i].Connections[0].ConnectionType.Title
    // && response[i].AddressInfo
    // && response[i].Connections[0].Level
    // && response[i].Connections[0].Level.Title
    // // && response[i].Connections[0].Level.Title=="Level 1 : Low (Under 2kW)"
    // ) {
    // Add a new marker to the cluster group and bind a pop-up
    // markers.addLayer(L.marker([location.Latitude, location.Longitude])
    //   .bindPopup("<h3>"+response[i].AddressInfo.Title+"</h3><hr><p>"+"ConnectionType: "+ response[i].Connections[0].ConnectionType.Title + "</p> <p> Power Level: " + response[i].Connections[0].Level.Title + '</p><a href="' + link + '  target="_blank">' + direction + "</a><br>" +detail));
    //   console.log("Complete!")
    
      // }
 
  }
  // myMap.addLayer(markers)

  //Seach Nearby Button Handler
  function handleSearchNearBy() {

    d3.event.preventDefault();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      console.log(navigator.geolocation.getCurrentPosition(showPosition))
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    current_location=[lat,lng]
    
    console.log(current_location);
    // getData(current_location);
    buildMap(current_location);
  };

var Mymarker = {};
if (Mymarker.length>0) {
  Mymarker.remove()
}
function buildMap(current_location) {
// Create a new marker
// Pass in some initial options, and then add it to the map using the addTo method
var Mymarker = L.circle(current_location).addTo(myMap);
// Binding a pop-up to our marker
Mymarker.bindPopup("You Are Here");
myMap.panTo(Mymarker.getLatLng());
myMap.setZoom(15);
};

  d3.select("#submit").on("click", handleSearchNearBy);
});


