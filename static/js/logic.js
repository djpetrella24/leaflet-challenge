var myMap = L.map("map", {
  center: [45.52, -122.67],
  zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

function markerSize(mag){
  return mag * 4
}

function markerColor(color) {
  return color > 5 ? "#EA2C2C" :
  color > 4  ? "#EA822C" :
  color > 3  ? "#EE9C00" :
  color > 2  ? "#EECC00" :
  color > 1   ?  "#D4EE00" :
           "#98EE00";

}
// Grabbing our GeoJSON data..
d3.json(link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {

    // Called on each feature
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");

    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng,
        {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8

        })
    }
  }).addTo(myMap);

  var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Magnitude</strong>'],
    categories = ['0','1','2','3','4','5'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + markerColor(categories[i]) + '"></i> ' +
                + categories[i] + (categories[i + 1] ? "&ndash;" + categories[i + 1] + "<br>" : "+"));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
legend.addTo(myMap);
});

