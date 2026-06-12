import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDBT5OrIGqtteAVVGrrKVmDQzPSMP4AZh4",
  authDomain: "structure-hub-ad362.firebaseapp.com",
  projectId: "structure-hub-ad362",
  storageBucket: "structure-hub-ad362.firebasestorage.app",
  messagingSenderId: "453464508382",
  appId: "1:453464508382:web:483b465004efe82ac1bf4f",
  measurementId: "G-2PBT57LWD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Optional but good to have)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
