  
      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      const time = document.querySelector("#time");
      const change = document.querySelector("#changes");
      const defaultText = document.querySelector("#default");
     
      time.addEventListener("click", function(){

      });

      change.addEventListener("click", function(){

      });

      defaultText.addEventListener("click", function(){

      });

      var map, pos, countTime, countChange;
      function initMap() {

        getMarkers();

        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 14
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
           pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          map.setCenter(pos);
          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title:"Hello World!"
          });

        });
        }
        
      }

      function addMarkers(locations) {
        // saving data
        
        locationsData = locationsData.concat(locations);

        console.log("adding markers");

        locations.forEach((doc) => {

          var myData = doc.data();
          var myLatlng = myData.latlng;

          var indexPostion = {
            lat: myLatlng.latitude,
            lng: myLatlng.longitude
          }

          var marker = new google.maps.Marker({
            position: indexPostion,
            map: map,
            title:"position " + myData.datetime,
            icon:new google.maps.MarkerImage(!myData.bytime ? 'https://image.flaticon.com/icons/svg/1281/1281225.svg' : 'https://image.flaticon.com/icons/svg/1281/1281188.svg',
              null, null, null, new google.maps.Size(10,10))
          });

          var infowindow = new google.maps.InfoWindow({
            content: `${myData.datetime}`
          });

          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });

          if(myData.bytime){
            countTime++;
          }else{
            countChange++;
          }

        });

       
        updateBanner();
      }



      function updateBanner(){


        defaultText.innerText = countTime + countChange;
        change.innerText = "Prueba 2";
      }


