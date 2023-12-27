// Import the functions you need from the SDKs you need
import { initializeApp ,getApps,FirebaseApp ,getApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseStorage, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg7cs9Qu1NZjc2dnmyUJ-1ggol9aCoAr0" ,
  authDomain: "auth-410b5.firebaseapp.com",
  projectId: "auth-410b5",
  storageBucket: "auth-410b5.appspot.com",
  messagingSenderId: "1066868869858",
  appId: "1:1066868869858:web:7f33dece3ac0189222ecbb",
  measurementId: "G-LHV6XH3JVW"
};

// Initialize Firebase
const apps = getApps();
export const app = initializeApp(firebaseConfig);
//export const app = getApps().length  ? initializeApp(firebaseConfig): getApp();
export const storage = getStorage(app);
// console.log('Storage instance:', storage);
// console.log('Storage _url:', (storage as any)._url);
const analytics = getAnalytics(app);