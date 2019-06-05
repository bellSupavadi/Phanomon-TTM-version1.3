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
 /*   var db = firebase.firestore();
    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: false
    }); */

    function regis(){

      var fullname = document.getElementById('fullname').value;
      var usern = document.getElementById('user').value;
      var email = document.getElementById('email').value;
      var pass = document.getElementById('pass').value;
      
     const register = firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user){
        alert("userRegis:"+user);
      
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.code+':'+error.message);
      //  ons.notification.alert(error.code+':'+error.message);
      });
      }

     function initAuth(){   // ฟังก์ชั่นนี้ใช้เช็คว่า มีการ Login เข้ามาแล้วหรือไม่   

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("signIN!");
            alert("signIN!");
            // User is signed in.
          //  window.location.href='hom e.html'
          }else{
            console.log("null Login"); 
            alert("null Login!");
          }
        }); 
     }


      function logout(){

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('User Logged Out!');
      }).catch(function(error) {
        // An error happened.
        console.log(error);
      });
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
         window.location.href='index.html'
          // ...
        } 
      });
    }

      
      function login() {
        
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        alert("username:"+username)
        alert("password:"+password)
        firebase.auth().signInWithEmailAndPassword(username, password).then(function(data){

          alert("sign in success");
          initAuth();


        }).catch(function(error) {
        // Handle Errors here.
        alert("test auth");
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode != 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
          
        }
       
      });
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
         window.location.href='home.html'
          // ...
        } 
      });
      };

      

//getData() // อันนี้เราทดลองเรียกฟังก์ชั่นข้างล่างเฉยๆ

function getData(){ // << สร้างฟังก์ชั่นขึ้นมาสักอันนึง

    let solaryear = '2400'  // หาวิธีเอาค่ามาใส่เองดู  อันนี้เป็นตัวอย่างแบบใส่แบบเรากำหนดเอง
    let solarmonth = '2'
    let solarday = '25'

    axios.get('https://us-central1-phanomonttm.cloudfunctions.net/api/findDay/'+solaryear+'/'+solarmonth+'/'+solarday+'/',)
      .then(function (response) {
        console.log(response.data.data.solaryear); // << ตรงนี้เป็นความผิดพลาดของเราเอง ให้พิมพ์ response.data.data อีกทีนึงนะ มันมี data เบิ้ลมา
      })
      .catch(function (error) {
       console.log(error)
      });


}
     
      
