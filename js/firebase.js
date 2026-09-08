import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_kDQDjmXgSbGV5MoIttUJl8z_DEpxJRU",
  authDomain: "nexa-front.firebaseapp.com",
  projectId: "nexa-front",
  storageBucket: "nexa-front.firebasestorage.app",
  messagingSenderId: "110311424919",
  appId: "1:110311424919:web:b99b9fb44661f902797ad2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);