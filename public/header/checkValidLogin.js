checkValidLogin()
function checkValidLogin(){
firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    
    
    window.location.href = 'index.html'
  }
});
}