var myMap = L.map("map", {
  center: [39.81362, -98.55421],
  zoom: 4
})


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.light',
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude*30000;
}

d3.json(url, function(response){

  d3.select("title").text(response.metadata.title)

  const colours = ["#BFFF00", "#FFFF00","#FFBF00","#FF8000","#FF4000","#FF0000"];
  const magnitudes = [];

  for (let i = 0; i < response.features.length; i++) {
    let location = response.features[i];
    if (location) {
        let magnitude = location.properties.mag
        magnitudes.push(magnitude);
        
        let color = ""
        if (magnitude < 1){
            color = colours[0]
        }
        else if (magnitude >= 1 && magnitude < 2){
            color = colours[1]
        }
        else if (magnitude >= 2 && magnitude < 3){
          color = colours[2]
        }
        else if (magnitude >= 3 && magnitude < 4){
          color = colours[3]
        }
        else if (magnitude >= 4 && magnitude < 5){
          color = colours[4]
        }
        else if (magnitude >= 5){
          color = colours[5]
        }

        L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]],{
            fillOpacity: 0.75,
            color: "white",
            weight: 0.85,
            fillColor: color,
            radius: markerSize(magnitude)
        }).bindPopup("<h1>" + location.properties.place + "</h1> <hr> <h3>Magnitude: " + location.properties.mag + "</h3><h3>Magnitude: " + location.properties.time + "</h3>").addTo(myMap);
    }
    
  }
  var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");
          var limits = [1,2,3,4,5, Math.max(magnitudes)];
          var colors = colours;
          var labels = [];
      
          // Add min & max
          var legendInfo = 
            "<div class=\"labels\">" +
              "<div>" + limits[0] + "</div>" +
              "<div>" + limits[1] + "</div>" +
              "<div>" + limits[2] + "</div>" +
              "<div>" + limits[3] + "</div>" +
              "<div>" + limits[4] + "</div>" +
              "<div>" + "5+" + "</div>" +
            "</div>";
      
          div.innerHTML = legendInfo;
      
          limits.forEach(function(limit, index) {
            if (limits[index] == Math.max(magnitudes)){
                labels.push("q<li style=\"background-color: " + colors[index] + "\"></li>");
            }
            else{
              labels.push(limits[index] + "<li style=\"background-color: " + colors[index] + "\"></li>");
            }
          });
      
          div.innerHTML += "<ul>" + labels.join("") + "</ul>";
          return div;
        };
      
        // Adding legend to the map
        legend.addTo(myMap);

});
