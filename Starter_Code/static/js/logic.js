let greyscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';


d3.json(url).then(function (data) {
    console.log(data);
    
    createFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude * 100000;
};

function chooseColor(depth) {
    if (depth <= 10) return "orange";
    else if (depth <= 30) return "red";
    else if (depth <= 50) return "purple";
    else if (depth <= 70) return "blue";
    else if (depth <= 90) return "pink";
    else return "black";
}

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        
        pointToLayer: function (feature, latlng) {

           
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                color: "black",
                stroke: true,
                weight: 1
            }
            return L.circle(latlng, markers);
        }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    var overlayMaps

    var myMap = L.map("map", {
        center: [1, 1],
        zoom: 2,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Depth Color Legend</h4>";
        div.innerHTML += '<col style="background: orange"></col><span>10 km or less</span><br>';
        div.innerHTML += '<col style="background: red"></col><span>30 km or less</span><br>';
        div.innerHTML += '<col style="background: purple"></col><span>50 km or less</span><br>';
        div.innerHTML += '<col style="background: blue"></col><span>70 km or less</span><br>';
        div.innerHTML += '<col style="background: pink"></col><span>90 km or less</span><br>';
        div.innerHTML += '<col style="background: black"></col><span>More than 90 km</span><br>';
            return div;
    };

    legend.addTo(myMap);
}