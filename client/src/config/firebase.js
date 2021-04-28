
//Configuration for firebase authentication
import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDmisQQVZmGTTDGgVT5Qpb9TvOFAsc1XV8",
  authDomain: "attendance-app-4d754.firebaseapp.com",
  projectId: "attendance-app-4d754",
  storageBucket: "attendance-app-4d754.appspot.com",
  messagingSenderId: "740949861929",
  appId: "1:740949861929:web:68940f849bd0abef349e38"
};

firebase.initializeApp(firebaseConfig);
export default firebase;