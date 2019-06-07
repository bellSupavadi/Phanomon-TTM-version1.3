checkValidLogin()
function checkValidLogin(){
firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    console.log("null Login");
    alert("null Login!");
    window.location.href = 'index.html'
  }
});
}