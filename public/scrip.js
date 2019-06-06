$(document).ready(function () {
  $(".register").click(function () {
    $(".other").show();
    $(".content").hide();
    $(".register").addClass('active');
    $(".login").removeClass('active');
  });
  $(".login").click(function () {
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
 /*  db.settings({
       timestampsInSnapshots: false
   }); */

async function regis() {

  var fullname = document.getElementById('fullname').value;
  var usern = document.getElementById('user').value;
  var email = document.getElementById('email').value;
  var pass = document.getElementById('pass').value;

  let validate = await checkValidateUser(usern);
  if(validate){
  const register = firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {
    alert("userRegis:" + user);
    db.collection("user").add({ //เพิ่มใหม่ตรงนี้้
      fullname: fullname,
      username: usern,
      email: email,
      password: pass
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.href = 'index.html'
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
    
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.code + ':' + error.message);
    //  ons.notification.alert(error.code+':'+error.message);
  });
}else{
  console.log("รหัสซํ้ากัน")
}
}

async function checkValidateUser(username){

  console.log("check:"+username)
  let validate = true;

 await db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
       console.log(`${doc.id} => ${doc.data().username}`);
       if(doc.data().username == username){

        validate = false;
       }
       console.log("come to check")

    });

   

  });
 
  return validate
}

    // ฟังก์ชั่นนี้ใช้เช็คว่า มีการ Login เข้ามาแล้วหรือไม่   
function initAuth(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("signIN!");
      alert("signIN!");
      
          window.location.href = 'home.html'
          // ...
        }
  
     else {
      console.log("null Login");
      alert("null Login!");
      window.location.href = 'index.html'
    }
  }); 
}

//logout();
 function logout() {

  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    console.log('User Logged Out!');
   // window.location.href = 'index.html'
    initAuth();
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
  
  
}
function login() { 

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  alert("username:" + username)
  alert("password:" + password)
  db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
       console.log(`${doc.id} => ${doc.data().username}`);
       if(doc.data().username == username && doc.data().password == password ){
         console.log("login success")
         checkLogin(doc.data().email,doc.data().password);
       }
       else{

       }
        
    });
  });

};

function checkLogin(email,password){
  firebase.auth().signInWithEmailAndPassword(email,password).then(function (data) {

    
    alert("sign in success");
    initAuth();

 }).catch(function (error) {
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
}
function forgot(){
  const email = document.getElementById('emailReset').value;
  firebase.auth().sendPasswordResetEmail(email)
  .then(function() {
	alert('Reset link has been sent to provided email address');
  }).catch(function (error) {
    console.log(error)
  });
  
  
}
// window.onload = function(e){ 
//   initAuth();
// }

//getData() // อันนี้เราทดลองเรียกฟังก์ชั่นข้างล่างเฉยๆ
function getData() { // << สร้างฟังก์ชั่นขึ้นมาสักอันนึง

  let solaryear = document.getElementById("year").value;
  let solarmonth = document.getElementById("month").value;
  let solarday = document.getElementById("day").value;
   getAPI(solaryear,solarmonth,solarday)
  // getAPI(solaryear,solarmonth-9,solarday)
  
  
}



function getAPI(solaryear,solarmonth,solarday) { 
  
  axios.get('https://us-central1-phanomonttm.cloudfunctions.net/api/findDay/' + solaryear + '/' + solarmonth + '/' + solarday + '/')
    .then(function (response) {
      let objectMoon = response.data.data
      calculator(objectMoon);
      
      
    })
    .catch(function (error) {
      console.log(error)
    });
   
}


function calculator(objectMoon){
 
 var html=''
 var datamoon = ''
  String(objectMoon.moontype)
      if (objectMoon.moontype == "ขึ้น") {
        if (objectMoon.moonday >= 1 && objectMoon.moonday <= 15) {
           html += objectMoon.moontype + objectMoon.moonday + 'ค่ำ' + 'เดือน' + objectMoon.moonmount
          document.getElementById('show_moondate').innerHTML = html;          
          console.log(objectMoon.moontype + objectMoon.moonday + "ค่ำ" + "เดือน" + objectMoon.moonmount);
          if (objectMoon.moonmount == 1) {
            datamoon += 'กรีสะ'
            document.getElementById('show_datamoon').innerHTML = datamoon;
            console.log("กรีสะ")
          }
          else if (objectMoon.moonmount == 2) {
            datamoon += 'สุมนาวาสะ'
            document.getElementById('show_datamoon').innerHTML = datamoon;
            console.log("สุมนาวาสะ")
          }
          else if (objectMoon.moonmount == 3) {
            console.log("คูถเสมหะ")
          }
          else if (objectMoon.moonmount == 4) {
            console.log("พัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 5) {
            console.log("หทัยวัตถุ")
          }
          else if (objectMoon.moonmount == 6) {
            console.log("หทัยวาตะ")
          }
          else if (objectMoon.moonmount == 7) {
            console.log("ศอเสมหะ")
          }
          else if (objectMoon.moonmount == 8) {
            console.log("อพัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 9) {
            console.log("อุทริยะ")
          }
          else if (objectMoon.moonmount == 10) {
            datamoon += 'สัตถกวาตะ'
            document.getElementById('show_datamoon').innerHTML = datamoon;
            console.log("สัตถกวาตะ")
          }
          else if (objectMoon.moonmount == 11) {
            console.log("อุระเสมหะ")
          }
          else if (objectMoon.moonmount == 12) {
            console.log("กำเดา")
          }
        }
        
      }
      else if (objectMoon.moontype == "แรม"){
        if (objectMoon.moonday >= 1 && objectMoon.moonday <= 15) {
          html += objectMoon.moontype + objectMoon.moonday + 'ค่ำ' + 'เดือน' + objectMoon.moonmount
          document.getElementById('show_moondate').innerHTML = html;

          console.log(objectMoon.moontype + objectMoon.moonday + "ค่ำ" + "เดือน" + objectMoon.moonmount);
          html += objectMoon.moontype + objectMoon.moonday + 'ค่ำ' + 'เดือน' + objectMoon.moonmount
          document.getElementById('show_moondate').innerHTML = html;
          if (objectMoon.moonmount == 1) {
            console.log("กรีสะ")
          }
          else if (objectMoon.moonmount == 2) {
            console.log("สุมนาวาสะ")
          }
          else if (objectMoon.moonmount == 3) {
            console.log("คูถเสมหะ")
          }
          else if (objectMoon.moonmount == 4) {
            console.log("พัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 5) {
            console.log("หทัยวัตถุ")
          }
          else if (objectMoon.moonmount == 6) {
            console.log("หทัยวาตะ")
          }
          else if (objectMoon.moonmount == 7) {
            console.log("ศอเสมหะ")
          }
          else if (objectMoon.moonmount == 8) {
            console.log("อพัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 9) {
            console.log("อุทริยะ")
          }
          else if (objectMoon.moonmount == 10) {
            console.log("สัตถกวาตะ")
          }
          else if (objectMoon.moonmount == 11) {
            console.log("อุระเสมหะ")
          }
          else if (objectMoon.moonmount == 12) {
            console.log("กำเดา")
          }
        }
      }
      else {
        console.log(objectMoon.moontype + objectMoon.moonday + "ค่ำ" + "เดือน" + objectMoon.moonmount);
      } // << ตรงนี้เป็นความผิดพลาดของเราเอง ให้พิมพ์ response.data.data อีกทีนึงนะ มันมี data เบิ้ลมา
          
}
