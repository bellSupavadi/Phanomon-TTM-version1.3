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
$(function() {
  
  $("#registration").validate({
    
    rules: {
    
      fullname: {
        required: true,
      },
      user: "required",
      email: {
        required: true,
        email: true
      },
      pass: {
        required: true,
        minlength: 5
      }
    },
    
    messages: {
      fullname: "กรุณาระบุชื่อ-สกุล ให้ถูกต้อง",
      user: "กรุณาระบุ username",
      pass: {
        required: "กรุณาระบุรหัสผ่าน",
        minlength: "กรุณาระบุรหัสผ่าน ( A-Z,a-z,0-9) ไม่ต่ำกว่า 6 อักษรและไม่เกิน 12 ตัวอักษร"
      },
      email: "กรุณาระบุ Email ที่ถูกต้อง"
    },
    
   /* submitHandler: function(form) {
      form.submit();
    } */
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
async function login() { 
  let validate = false
  var username = await document.getElementById('username').value;
  var password = await document.getElementById('password').value;
  alert("username:" + username)
  alert("password:" + password)
  await db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
       console.log(`${doc.id} => ${doc.data().username}`);
       if(doc.data().username == username && doc.data().password == password ){

         validate = true;
         checkLogin(doc.data().email,doc.data().password);
       }
       
        
    });
  });
  if(validate == false){
    handleLoginError()
  }
};

function handleLoginError(){

}

function checkLogin(email,password){
  firebase.auth().signInWithEmailAndPassword(email,password).then(function (data) {

    
    alert("sign in success");
    initAuth();

 }).catch(function (error) {
   // Handle Errors here.
   handleLoginError();
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
  let email = document.getElementById('emailReset').value;
  firebase.auth().sendPasswordResetEmail(email)
  .then(function() {
	alert('Reset link has been sent to provided email address');
  }).catch(function (error) {
    console.log(error)
  });
  
  
}



function resetPassword(){
  let params = (new URL(document.location)).searchParams;
  let email = params.get("email");
  let password = document.getElementById('newPass').value;
  //console.log(email)
  let validate = resetValidate(email,password)
  if(validate){
    console.log("ไปหน้าหลัก");
  }else{
    console.log("ขึ้น Error");
  }
}


async function resetValidate(email,password){

  console.log("check:"+email)
  let validate = false;

 await db.collection("user").where("email", "==", email).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
       console.log(`${doc.id} => ${doc.data().username}`);
       if(doc.data().email == email){
        db.collection("user").doc(doc.id).update({password: `${password}`});
        validate = true;
       }
       console.log("come to check")

    });

  });
 
  return validate
}

async function getData() { 

  let solaryear =  document.getElementById("year").value;
  let solarmonth =  document.getElementById("month").value;
  let solarday =  document.getElementById("day").value;
  
  let solarmonthPlus = solarmonth - 9
  
   
   
  let val1 =  await getAPI(solaryear,solarmonth,solarday)
  let val2 = 'null'
  if(solarmonthPlus >= 0){
   val2 =  await getAPI(solaryear,solarmonthPlus,solarday)
  }
  
  
  localStorage.setItem("val1", JSON.stringify(val1))
  localStorage.setItem("val2", JSON.stringify(val2))
  console.log(localStorage.getItem("val1"))
  console.log(localStorage.getItem("val2"))
  window.location.href = 'output.html'
}
  

function sendOutput(){
  let obj1 = localStorage.getItem("val1");
  let obj2 = localStorage.getItem("val2");
  console.log("obj1:"+obj1)
  console.log("obj2:"+obj2)
  calculator(obj1);
  if(obj2 != null){
  calculator(obj2);
  }
}




async function getAPI(solaryear,solarmonth,solarday) { 
  var objectMoon = {}
 await axios.get('https://thaicalendarapi.herokuapp.com/api/findDay/' + solaryear + '/' + solarmonth + '/' + solarday + '/')
    .then(function (response) {
      objectMoon = response.data.data
      //calculator(objectMoon);
      
      
    })
    .catch(function (error) {
      console.log(error)
    });

    return objectMoon
   
}

function calculator(objMoon){
  var html=''
var datamoon = ''
let objectMoon = JSON.parse(objMoon)
  console.log("ObjectMoon:"+objectMoon.solarday)
  String(objectMoon.moontype) 
      if (objectMoon.moontype == "ขึ้น") {
        if (objectMoon.moonday >= 1 && objectMoon.moonday <= 15) {
           html += objectMoon.moontype + objectMoon.moonday + 'ค่ำ' + 'เดือน' + objectMoon.moonmount+'<br>'
          document.getElementById('show_moondate').innerHTML += html;          
          console.log(objectMoon.moontype + objectMoon.moonday + "ค่ำ" + "เดือน" + objectMoon.moonmount);
          if (objectMoon.moonmount == 1) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กรีสะ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุปถวี'
            document.getElementById('show_moondate').innerHTML += datamoon;
            console.log("กรีสะ")
          }
          else if (objectMoon.moonmount == 2) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : สุมนาวาสะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุปถวี'
            document.getElementById('show_moondate').innerHTML += datamoon;
            console.log("สุมนาวาสะ")
          }
          else if (objectMoon.moonmount == 3) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : คูถเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุปถวี'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("คูถเสมหะ")
          }
          else if (objectMoon.moonmount == 4) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : พัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุเตโช'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("พัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 5) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวัตถุ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุเตโช'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("หทัยวัตถุ")
          }
          else if (objectMoon.moonmount == 6) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุเตโช'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("หทัยวาตะ")
          }
          else if (objectMoon.moonmount == 7) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : ศอเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("ศอเสมหะ")
          }
          else if (objectMoon.moonmount == 8) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อพัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("อพัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 9) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุทริยะ'+'<br>'+'อสุริญธัญญาณธาตุ : ลมธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("อุทริยะ")
          }
          else if (objectMoon.moonmount == 10) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : วาโธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : สัตถกวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("สัตถกวาตะ")
          }
          else if (objectMoon.moonmount == 11) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุระเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุอาโป'
            document.getElementById('show_moondate').innerHTML += datamoon;
            console.log("อุระเสมหะ")
          }
          else if (objectMoon.moonmount == 12) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กำเดา'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุอาโป'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("กำเดา")
          }
        }
        
      }
      else if (objectMoon.moontype == "แรม"){
        if (objectMoon.moonday >= 1 && objectMoon.moonday <= 15) {
          html += objectMoon.moontype + objectMoon.moonday + 'ค่ำ' + 'เดือน' + objectMoon.moonmount
          document.getElementById('show_moondate').innerHTML += html;

          console.log(objectMoon.moontype + objectMoon.moonday + "ค่ำ" + "เดือน" + objectMoon.moonmount);
          if (objectMoon.moonmount == 1) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กรีสะ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุปถวี'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("กรีสะ")
          }
          else if (objectMoon.moonmount == 2) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : สุมนาวาสะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุปถวี'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("สุมนาวาสะ")
          }
          else if (objectMoon.moonmount == 3) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : คูถเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุปถวี'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("คูถเสมหะ")
          }
          else if (objectMoon.moonmount == 4) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : พัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุเตโช'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("พัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 5) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวัตถุ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุเตโช'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("หทัยวัตถุ")
          }
          else if (objectMoon.moonmount == 6) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุเตโช'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("หทัยวาตะ")
          }
          else if (objectMoon.moonmount == 7) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : ศอเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("ศอเสมหะ")
          }
          else if (objectMoon.moonmount == 8) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อพัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("อพัทธะปิตตะ")
          }
          else if (objectMoon.moonmount == 9) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุทริยะ'+'<br>'+'อสุริญธัญญาณธาตุ : ลมธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("อุทริยะ")
          }
          else if (objectMoon.moonmount == 10) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : วาโธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : สัตถกวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุวาโย'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("สัตถกวาตะ")
          }
          else if (objectMoon.moonmount == 11) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุระเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุอาโป'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("อุระเสมหะ")
          }
          else if (objectMoon.moonmount == 12) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กำเดา'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุอาโป'
            document.getElementById('show_datamoon').innerHTML += datamoon;
            console.log("กำเดา")
          }
        }
      }
      else {
        console.log(objectMoon.moontype + objectMoon.moonday + "ค่ำ" + "เดือน" + objectMoon.moonmount);
      } // << ตรงนี้เป็นความผิดพลาดของเราเอง ให้พิมพ์ response.data.data อีกทีนึงนะ มันมี data เบิ้ลมา
          
}
