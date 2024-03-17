// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
function FirebaseConfig() {
    const firebaseConfig = {
        apiKey: "AIzaSyDYb_015HwNw1zddOAmWODIYMq9ciBBy38",
        authDomain: "parcel-path.firebaseapp.com",
        databaseURL: "https://parcel-path-default-rtdb.firebaseio.com",
        projectId: "parcel-path",
        storageBucket: "parcel-path.appspot.com",
        messagingSenderId: "363198859933",
        appId: "1:363198859933:web:685c7fc6477fb583632274",
        measurementId: "G-FZCX5M6GFD"
      };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return getDatabase(app)
}

export default FirebaseConfig
