$(document).ready(function(){
    $(".register").click(function(){
      $(".other").show();
      $(".content").hide();
      $(".register").addClass('active');
      $(".login").removeClass('active');
    });
    $(".login").click(function(){
      $(".content").show();
      $(".other").hide();
      $(".login").addClass('active');
      $(".register").removeClass('active');
    });
  });

  var config = {
    apiKey: "AIzaSyBNRq5FqP_x4xMTXbki_ir825uJMnCw0QE",
    authDomain: "phanomonttm.firebaseapp.com",
    databaseURL: "https://phanomonttm.firebaseio.com",
    projectId: "phanomonttm",
    storageBucket: "phanomonttm.appspot.com",
    messagingSenderId: "39151834196",
    appId: "1:39151834196:web:f581d3e227550098"
  };
//   if (!firebase.apps.length) {
    firebase.initializeApp(config);
//  }

      // Initialize Cloud Firestore through Firebase
      var db = firebase.firestore();
      // Disable deprecated features
      db.settings({
          timestampsInSnapshots: true
      });

      function regis(){
  
        var fullname = document.getElementById('fullname').value;
        var usern = document.getElementById('user').value;
        var email = document.getElementById('email').value;
        var pass = document.getElementById('pass').value;
        
        firebase.auth().createUserWithEmailAndPassword(usern, pass).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          ons.notification.alert(error.code+':'+error.message);
        });
        };
        
        
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
          //  window.location.href='hom e.html'
            // ...
            ons.notification.alert('Regis');
          } 
        });
        
        
        function login() {
          var username = document.getElementById('username').value;
          var password = document.getElementById('password').value;
          firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error.code+':'+error.message);
          ons.notification.alert('login failed');
          
          // ...
        });
        };
         firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
           window.location.href='home.html'
            // ...
          } 
        });