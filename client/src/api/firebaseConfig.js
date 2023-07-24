// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAWeBAutS8EYgL8t_t0jQlucCAumLW7jI",
  authDomain: "synagougeapp.firebaseapp.com",
  projectId: "synagougeapp",
  storageBucket: "synagougeapp.appspot.com",
  messagingSenderId: "537863551291",
  appId: "1:537863551291:web:350d81d13d4c049d679f1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;