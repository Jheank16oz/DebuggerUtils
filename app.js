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
    console.log("getting locations"); 

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
  


