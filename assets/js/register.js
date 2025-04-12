
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2C4zI4bgW5WHupk5M4HQHRC0wVfPjNHQ",
  authDomain: "chickflix-67edb.firebaseapp.com",
  projectId: "chickflix-67edb",
  storageBucket: "chickflix-67edb.firebasestorage.app",
  messagingSenderId: "1094095189606",
  appId: "1:1094095189606:web:8f87fb6814031b79781fa7",
  measurementId: "G-X7L7CWKT81"
};



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function registerUser() {
    const email = document.getElementById('signup-email').value;
    const password  = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Registration successful!");
            window.location.href = "signin.html"; // Redirect to login page
        })
        .catch((error) => {
            alert(error.message);
        });
}


