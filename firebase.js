// Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Auth
const auth = firebase.auth();