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
      user: {
        required: true,
      },
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
    
  });
});

var config = {
  apiKey: "AIzaSyAPmqcYlY0Sv7FBrD9xRM9s_xTnT5dA6iY",
    authDomain: "phanomonttm-96907.firebaseapp.com",
    databaseURL: "https://phanomonttm-96907.firebaseio.com",
    projectId: "phanomonttm-96907",
    storageBucket: "phanomonttm-96907.appspot.com",
    messagingSenderId: "555465126729",
    appId: "1:555465126729:web:193e184a24570eaf"
};
firebase.initializeApp(config);


// Initialize Cloud Firestore through Firebase
   var db = firebase.firestore();


async function regis() {

  var fullname = document.getElementById('fullname').value;
  var usern = document.getElementById('user').value;
  var email = document.getElementById('email').value;
  var pass = document.getElementById('pass').value;

  let validate = await checkValidateUser(usern,email);
  
  if(validate){
  await addUser(fullname,usern,email,pass);
  const register = await firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {
    alert("การลงทะเบียนเสร็จสิ้น");
    
  
  }).catch(function (error) {
    
    alert("อีเมล์ของคุณมีผู้ใช้แล้ว")
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.code + ':' + error.message);
   
  });


}else{
  
  alert("เกิดข้อผิดพลาด รหัสอาจจะซํ้ากัน หรือ อีเมล์นี้มีผู้ใช้แล้ว");
}


}




async function addUser(fullname,usern,email,pass){
  const addUser = await db.collection("user").add({ 
     fullname: fullname,
     username: usern,
     email: email,
     password: pass
 })
 .then(function(docRef) {
     
     
    
 })
 .catch(function(error) {
     console.error("Error adding document: ", error);
 });
}

async function checkValidateUser(username,email){

  
  let validate = true;

 await db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      
       if(doc.data().username == username || doc.data().email == email){

        validate = false;
       }
      

    });

   

  });
 
  return validate
}


function initAuth(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      alert("เข้าสู่ระบบเรียบร้อย");
      
          window.location.href = 'home.html'
          // ...
        }
  
     else {
      
     
      window.location.href = 'index.html'
    }
  }); 
}


 function logout() {

  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    alert("ออกจากระบบ");
    initAuth();
  }).catch(function (error) {
    // An error happened.
  });
  
  
}
async function login() { 
  let validate = false
  var username = await document.getElementById('username').value;
  var password = await document.getElementById('password').value;
  
  await db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
       if(doc.data().username == username && doc.data().password == password ){

         validate = true;
         checkLogin(doc.data().email,doc.data().password);
       }
       
        
    });
  });
  if(validate == false){
    alert("รหัสสำหรับเข้าสู่ระบบไม่ถูกต้อง")
  }
};


function checkLogin(email,password){
  firebase.auth().signInWithEmailAndPassword(email,password).then(function (data) {

    
    // alert("sign in success");
    initAuth();

 }).catch(function (error) {
   // Handle Errors here.
   handleLoginError();
   alert("Username ไม่ถูกต้อง");
   var errorCode = error.code;
   var errorMessage = error.message;
   if (errorCode != 'auth/wrong-password') {
     alert('รหัสผ่านไม่ถูกต้อง');
   } else {
     alert(errorMessage);

   }

 });
}
function forgot(){
  let email = document.getElementById('emailReset').value;
  firebase.auth().sendPasswordResetEmail(email)
  .then(function() {
	alert('กรุณาตรวจเช็ค Email ของคุณ สำหรับขอรหัสผ่านใหม่ !');
  }).catch(function (error) {
  alert('Email นี้ไม่มีอยู่ในระบบสมาชิก ไม่สามารถส่งรหัสผ่านใหม่ให้คุณได้ !');
  });
  
  
}



async function resetPassword(){
  let params = (new URL(document.location)).searchParams;
  let email = params.get("email");
  let password = document.getElementById('newPass').value;
  let validate = await resetValidate(email,password)
  if(validate){
   alert('สร้างรหัสผ่านใหม่เรียบร้อย')
   alert('ผู้ใช้งานสามารถปิดหน้านี้แล้วกลับเข้าใช้งานได้')
  }else{
   
  }
}


async function resetValidate(email,password){

 
  let validate = false;
  let oldpassword = null;

  await db.collection("user").where("email", "==", email).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      
       if(doc.data().email == email){
        oldpassword = doc.data().password;
        db.collection("user").doc(doc.id).update({password: `${password}`});
       
        validate = true;
        
       }
    });

  });

  if(validate == true){
  await increaseToFriebaseAuth(email,oldpassword,password);
  }
  return validate
}

async function increaseToFriebaseAuth(email,oldpassword,password){
  let user
  let loadFinish = false
  await firebase.auth().signInWithEmailAndPassword(email,oldpassword).then(function (data) {
   
    user = firebase.auth().currentUser;
    loadFinish = true;
 }).catch(function (error) {
   // Handle Errors here.
   
   var errorCode = error.code;
   var errorMessage = error.message;
   if (errorCode != 'auth/wrong-password') {
     alert('รหัสผ่านไม่ถูกต้อง');
   } else {
     alert(errorMessage);

   }

 });

 if(loadFinish){
  await user.updatePassword(password).then(function() {

  }).catch(function(error) {
  console.log(error)
  });
  
  }
}

async function getData() { 

  let solaryear =  document.getElementById("year").value;
  let solarmonth =  document.getElementById("month").value;
  let solarday =  document.getElementById("day").value;
  let per =  document.getElementById("period").value;
  let ag = document.getElementById("age").value;
  let profes = document.getElementById("profession").value;
  let add = document.getElementById("address").value;
 

  let solarmonthPlus = solarmonth - 9
  
  
  let val1 =  await getAPI(solaryear,solarmonth,solarday)
  let val2 = 'null'

  if(solarmonthPlus > 0){
   val2 =  await getAPI(solaryear,solarmonthPlus,solarday)
  }else if(solaryear != 2400){
    solarmonthPlus =(parseInt(solarmonth) + 12)-9
    let solaryearPlus = solaryear-1
    
    val2 =  await getAPI(solaryearPlus,solarmonthPlus,solarday)
  }

  let val3 = profes
  let val4 = ag
  let val5 = add
  let val6 = per
  
  localStorage.setItem("val1", JSON.stringify(val1))
  localStorage.setItem("val2", JSON.stringify(val2))
  localStorage.setItem("val3",val3)
  localStorage.setItem("val4",val4)
  localStorage.setItem("val5",val5)
  localStorage.setItem("val6",val6)
 
  window.location.href = 'output.html'
}
  

function sendOutput(){
  let obj1 = localStorage.getItem("val1");
  let obj2 = localStorage.getItem("val2");
  let obj3 = localStorage.getItem("val3");
  let obj4 = localStorage.getItem("val4");
  let obj5 = localStorage.getItem("val5");
  let obj6 = localStorage.getItem("val6");
 
  sentDataarea(obj4,obj3,obj5,obj6);
  calculator(obj1);
  if(obj2 != null){
  calculator(obj2);
  };
  
  
  
       
}
function sentDataarea(ag,profes,add,per){
var area=''
let objPro = profes
let objAg = ag
let objAdd = add
let objPer = per
area +='ระยะตั้งครรภ์ : '+objPer+'  '+'เดือน'+'<br>'+'อายุ  : '+objAg+'  '+'ปี'+'<br>'+'อาชีพ : '+objPro+'<br>'+'ที่อยู่ : '+objAdd+'<br>'
document.getElementById('showData').innerHTML += area;  

}



async function getAPI(solaryear,solarmonth,solarday) { 
  var objectMoon = {}
 await axios.get('https://moondateapp.herokuapp.com/api/findDay/' + solaryear + '/' + solarmonth + '/' + solarday + '/')
    .then(function (response) {
      objectMoon = response.data.data
      
      
      
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
  
  String(objectMoon.moontype) 
      if (objectMoon.moontype == "ขึ้น") {
        if (objectMoon.moonday >= 1 && objectMoon.moonday <= 15) {
           html +='<br>' +objectMoon.moontype +'  '+ objectMoon.moonday +'  '+ 'ค่ำ' +'  '+ 'เดือน' +'  '+ objectMoon.moonmount+'<br>'
          document.getElementById('show_moondate').innerHTML += html;          
          
          if (objectMoon.moonmount == 1) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กำเดา'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุอาโป'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 2) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กรีสะ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุปถวี'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 3) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : สุมนาวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุปถวี'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 4) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : คูณสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุปถวี'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 5) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : พัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุเตโช'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 6) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวัตถุ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุเตโช'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 7) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุเตโช'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 8) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : ศอเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == '8,8') {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : ศอเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 9) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อพัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 10) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุทริยะ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 11) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : สัตถกวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุอาโป'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 12) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุระเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุอาโป'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
        }
        
      }
      else if (objectMoon.moontype == "แรม"){
        if (objectMoon.moonday >= 1 && objectMoon.moonday <= 15) {
          html +='<br>' +objectMoon.moontype +'  '+ objectMoon.moonday +'  '+ 'ค่ำ' +'  '+ 'เดือน' +'  '+ objectMoon.moonmount+'<br>'
          document.getElementById('show_moondate').innerHTML += html;

          
          if (objectMoon.moonmount == 1) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กรีสะ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุปถวี'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 2) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : สุมนาวาสะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุปถวี'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 3) {
            datamoon +='ธาตุประจำราศี : ดิน'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : คูถเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุปถวี'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 4) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : พัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุเตโช'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 5) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวัตถุ'+'<br>'+'อสุริญธัญญาณธาตุ : สมธาตุเตโช'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 6) {
            datamoon +='ธาตุประจำราศี : ไฟ'+'<br>'+ 'ธาตุแสดงผล : วาโยธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : หทัยวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุเตโช'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 7) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุกำเริบ'+'<br>'+'พิกัดธาตุที่ระคน : ศอเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 8) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อพัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == '8,8') {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อพัทธะปิตตะ'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          
          else if (objectMoon.moonmount == 9) {
            datamoon +='ธาตุประจำราศี : ลม'+'<br>'+ 'ธาตุแสดงผล : ปถวีธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุทริยะ'+'<br>'+'อสุริญธัญญาณธาตุ : ลมธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 10) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : วาโธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : สัตถกวาตะ'+'<br>'+'อสุริญธัญญาณธาตุ : มันทธาตุวาโย'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 11) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : อาโปธาตุหย่อน'+'<br>'+'พิกัดธาตุที่ระคน : อุระเสมหะ'+'<br>'+'อสุริญธัญญาณธาตุ : กติกธาตุอาโป'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
          else if (objectMoon.moonmount == 12) {
            datamoon +='ธาตุประจำราศี : น้ำ'+'<br>'+ 'ธาตุแสดงผล : เตโชธาตุพิการ'+'<br>'+'พิกัดธาตุที่ระคน : กำเดา'+'<br>'+'อสุริญธัญญาณธาตุ : วิสมธาตุอาโป'+'<br>'
            document.getElementById('show_moondate').innerHTML += datamoon;
            
          }
        }
      }
      else {
        
      } 
          
}
function myFunction() {
  document.getElementById("myForm").reset();
}
function myback(){
  window.location.href = 'home.html';
}