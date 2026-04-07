import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8UVBcDLJgXDOavx6d0hfH5Tmf9MgPpNI",
  authDomain: "hapinavi-64891.firebaseapp.com",
  databaseURL: "https://hapinavi-64891-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hapinavi-64891",
  storageBucket: "hapinavi-64891.firebasestorage.app",
  messagingSenderId: "642976439239",
  appId: "1:642976439239:web:edeb5ae183f4ad56d857e2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const trainRef = ref(db, "train");

onValue(trainRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  document.querySelector(".right-top").textContent = data.number;
  document.querySelector(".big").textContent = data.cars;
  document.querySelector(".next-text").textContent =
  "NEXT＞ " + data.next;

  console.log("Firebaseデータ:", data);
});