
$('#send').click(function () {
  deleteAllMarkers()

  var obj = JSON.parse(document.getElementById("json").value);

  addItems(obj)
})

$('#clear').click(function () {
  deleteAllMarkers()
})

function addItems(locations) {
  var messages = [];
  for (var i = 0; i < locations.length; i++) {
    var doc = locations[i]
    var indexPostion = {
      lat: Number(doc[0].latitud),
      lng: Number(doc[0].longitud)
    }

    var marker = new google.maps.Marker({
      zIndex: i,
      position: indexPostion,
      map: map,
      title:"position " + doc[0].idcontacto,
      icon:new google.maps.MarkerImage('https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green'+(i+1)+'.png',
        null, null, null, new google.maps.Size(25,40))
    });
    messages.push(`Estado coordenadas: ${doc[1].estado_coordenadas} <br>id-contacto: ${doc[0].idcontacto} <br>id-proveedor: ${doc[0].idproveedor}<br>Latlng: ${doc[0].latitud}, ${doc[0].longitud}`);

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(messages[this.zIndex]);
        infoWindow.open(map, this);
    });

    markers.push(marker);
    bounds.extend(marker.position);
  }



  //now fit the map to the newly inclusive bounds
  map.fitBounds(bounds);

}