  
      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
    
      var map, pos, countTime = 0, countChange = 0;
      var markers = [];
      var bounds;
      function initMap() {
      
        getMarkers();

        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 12
        });
        bounds = new google.maps.LatLngBounds();
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
           pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          map.setCenter(pos);
        });
      }
    }

      function addMarkers(locations) {
        locations.forEach((doc) => {
          var indexPostion = {
            lat: doc.LATITUD,
            lng: doc.LONGITUD
          }

          var marker = new google.maps.Marker({
            position: indexPostion,
            map: map,
            title:"position " + doc.FECHAHORA,
            icon:new google.maps.MarkerImage('https://image.flaticon.com/icons/svg/1281/1281225.svg',
              null, null, null, new google.maps.Size(10,10))
          });

          var infowindow = new google.maps.InfoWindow({
            content: `${doc.FECHAHORA} <br> ${doc.DISTANCIA} - ${doc.TIEMPO}`
          });

          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });

          markers.push(marker);
          bounds.extend(marker.position);

        });
       
        //now fit the map to the newly inclusive bounds
        map.fitBounds(bounds);

      }

      function deleteAllMarkers(){
        markers.forEach((marker) =>{
          marker.setMap(null);
          //clear all bounds
          bounds = new google.maps.LatLngBounds();

        });

        markers = [];
      }

      
      $(".dropdown-menu a").click(function(){
  
        $(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
        
      });
      


    