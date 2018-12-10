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
      const environment = $('input[name=enviromentRadios]:checked').val();
      const country = $(".btn:first-child").text().trim();
      const assistanceId = $("#assistanceId").val();

      
      if(!validateForm(environment, country, assistanceId)){
        return
      }
      
      const environmentStr = environment == "option1" ? "pruebas" : "produccion";
      var countryStr;

      switch(country) {
        case "Colombia":
          countryStr = "co";
          break;
        case "Guatemala":
          countryStr = "gt";
          break;
        case "Dóminicana":
          countryStr = "do";
          break;
        case "Ecuador":
          countryStr = "ec";
          break;
        case "Puerto Rico":
          countryStr = "pr"
          break;
        case "Uruguay":
          countryStr = "uy"
          break;
      }
      console.log(countryStr);

      deleteAllMarkers();

      $.ajax({
        url: "/obtener/" + environmentStr + "/" + countryStr + "/" + assistanceId,
        method: "GET",
        dataType: "json",
        crossDomain: true,
      }).done(function(data){
          const total = data.length;
          if( total > 0){
            addMarkers(data);
            displaySuccess("Se encontraron " + total + " resultados");
          }else{
            displayWarning("No Se encontraron resultados para la asistencia.");
          }
      }).fail(function(data){
            displayWarning("Error de conexión intente mas tarde");
            console.log("ERROR " + JSON.stringify(data))
      })

    })

    function validateForm(environment, country, assistanceId){
      if(environment.length == 0 || country.length == 0 || assistanceId.length == 0){
        displayWarning("Todos los campos son necesarios")
        return false;
      }
      return true;
    }

    function displayWarning(message){
      $("#alertNotFound").text(message);
      $("#alertNotFound").show();
      $("#alertFound").hide();
    }

    function displaySuccess(message){
      $("#alertFound").text(message);
      $("#alertFound").show();
      $("#alertNotFound").hide();
    }



  }
  


