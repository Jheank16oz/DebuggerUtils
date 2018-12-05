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

  console.log ("prueba");
  const docRef = firestore.doc("samples/sandwichData");
  const outputHeader = document.querySelector("#hotDogOutput");
  const inputTextField = document.querySelector("#latestHotDogStatus");
  const saveButton = document.querySelector("#saveButton");


saveButton.addEventListener("click", function(){
  const textToSave = inputTextField.value;
  console.log(" I am going to save " + textToSave + " to Firestore"); 

  docRef.set({
    hotDogStatus: textToSave
  }).then(function(){
    console.log("Status saved!"); 
  }).catch(function(error){
    console.log("Got an error:", error); 
  });

})