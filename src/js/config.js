export const API_URL_PLANT_LIST = "https://perenual.com/api/species-list";
export const API_URL_PLANT_DETAILS = "https://perenual.com/api/species/details";
export const API_URL_PLANT_CARE_GUIDE =
  "https://perenual.com/api/species-care-guide-list";
export const TIMEOUT_SEC = 7;
export const API_KEY = "sk-cNJ3665a979de83282125";
export const RESULTS_PER_PAGE = 10;
export const API_KEY_CAMERA =
  "qMVODKHS6GGURq4ukad6SukwYZ42PcEcoWDSgjPuez2kMtnDU9";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
//prettier-ignore
import {getFirestore,collection,getDocs,addDoc,deleteDoc,doc,onSnapshot,query,where,orderBy,serverTimestamp,Timestamp,
getDoc,updateDoc,setDoc,runTransaction} from "firebase/firestore";
//prettier-ignore
import {getAuth,createUserWithEmailAndPassword,signOut,signInWithEmailAndPassword, SignInMethod, signInWithPopup,GoogleAuthProvider,getAdditionalUserInfo, signInWithRedirect, getRedirectResult} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTd0PxnIoyfUWo05AOOkqWfAjb5v9deEM",
  authDomain: "plant-it-92469.firebaseapp.com",
  projectId: "plant-it-92469",
  storageBucket: "plant-it-92469.appspot.com",
  messagingSenderId: "367967417738",
  appId: "1:367967417738:web:ea55a0f512cb74abf90473",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//init auth
const auth = getAuth();
//init firestore
const db = getFirestore(app);
//init storage
const storage = getStorage(app);
//init googleSignin
const provider = new GoogleAuthProvider();
//login account
async function signIn() {
  try {
    // await signInWithEmailAndPassword(auth, email, password);
    await signInWithRedirect(auth, provider);
  } catch (e) {
    throw e.message;
  }
}
async function handleRedirectAuth() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const userinfo = getAdditionalUserInfo(result);
      console.log(userinfo);
      if (userinfo.isNewUser)
        if (userinfo.isNewUser) await newUserDB(result.user);
    }
  } catch (e) {
    throw e;
  }
}
//adds and checks to users db for duplicate
async function newUserDB(user) {
  try {
    console.log(user);
    await setDoc(
      doc(db, "userPlants", user.email),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        bookmarkplants: [],
        createdplants: [],
        AccountCreationDate: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    throw e;
  }
}
async function getUserProfile(email) {
  try {
    if (!email) return null;
    const docRef = doc(db, "userPlants", email);
    const getdoc = await getDoc(docRef);
    return getdoc.data();
  } catch (e) {
    throw e;
  }
}
async function updateUserPlantDatabase(newBookmarkPlants) {
  const docRef = doc(db, "userPlants", auth.currentUser.email);
  await updateDoc(docRef, { bookmarkplants: newBookmarkPlants });
}
export {
  signIn,
  handleRedirectAuth,
  auth,
  getUserProfile,
  updateUserPlantDatabase,
};
