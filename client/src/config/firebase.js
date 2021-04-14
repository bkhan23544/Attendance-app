
//Configuration for firebase authentication
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBSY2wi8mBlaYaiAY6AOZKld7g5TAhpG_Y",
  authDomain: "attendance-app-701f9.firebaseapp.com",
  projectId: "attendance-app-701f9",
  storageBucket: "attendance-app-701f9.appspot.com",
  messagingSenderId: "823012443362",
  appId: "1:823012443362:web:2a456b0951690b8ea10abb"
};

firebase.initializeApp(firebaseConfig);
export default firebase;