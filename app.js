  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "AIzaSyA70aeJHD2MnvS1mujNUMebHDaIwY5Jh-Q",
    authDomain: "location-tracker-44c70.firebaseapp.com",
    databaseURL: "https://location-tracker-44c70.firebaseio.com",
    projectId: "location-tracker-44c70",
    storageBucket: "location-tracker-44c70.appspot.com",
    messagingSenderId: "210081644033"
  };
  firebase.initializeApp(config);

  var firestore = firebase.firestore();


  function getMarkers(){
    $("#assistance").submit(function(event){
      event.preventDefault();
      deleteAllMarkers();
      $.ajax({
        url: "http://localhost:5000/obtener/" + $("#assistanceId").val(),
        method: "GET",
        dataType: "json",
        crossDomain: true,
      }).done(function(data){
          console.log(data)
          const total = data.length;
          if( total > 0){
            addMarkers(data);
            $("#alertFound").text("Se encontraron " + total + " resultados");
            $("#alertFound").show();

            $("#alertNotFound").hide();
          }else{
            $("#alertNotFound").text("No Se encontraron resultados para la asistencia." );
            $("#alertNotFound").show();

            $("#alertFound").hide();
          }
      }).fail(function(data){
        console.log("ERROR " + JSON.stringify(data))
      })

    })

    

  /*  firestore.collection("miercoles").orderBy("datetime", "desc").get().then((querySnapshot) => {
      addMarkers(querySnapshot);
      //getRealtimeUpdates();
    });
  }

  getRealtimeUpdates = function(){
    firestore.collection("miercoles").orderBy("datetime", "desc").onSnapshot(function(docs){
      addMarkers(docs);
    });*/


  }
  


