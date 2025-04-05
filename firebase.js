import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';
import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDUm8jzENisAOKujAhGjOsqa184hd0MlWo",
  authDomain: "expense-tracker-15167.firebaseapp.com",
  projectId: "expense-tracker-15167",
  storageBucket: "expense-tracker-15167.firebasestorage.app",
  messagingSenderId: "721814139251",
  appId: "1:721814139251:web:613fc2b5729b35998f1506",
  measurementId: "G-THVL4BHCCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export services and functions
export { 
    db,
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    doc,
    setDoc, 
    serverTimestamp
};
