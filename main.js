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

  // ===== 基本表示 =====
  document.querySelector(".right-top").textContent = data.number || "----";
  document.querySelector(".big").textContent = data.cars || "0";
  document.querySelector(".next-text").textContent =
    "NEXT＞ " + (data.next || "未設定");

  // ===== 種別 =====
  const typeEl = document.getElementById("type");
  const typeEnEl = document.getElementById("type-en");

  typeEl.textContent = data.type || "普通";
  typeEnEl.textContent = data.type_en || "Local";

  // ===== 色 =====
  const color = data.color || "#cccccc";
  typeEl.style.color = color;
  typeEnEl.style.color = color;

  // ===== フォント =====
  if (data.font === "jr") {
    typeEl.style.fontFamily = "JNR";                 // 日本語
    typeEnEl.style.fontFamily = "Arial, sans-serif"; // 英語
  } else {
    typeEl.style.fontFamily = "sans-serif";
    typeEnEl.style.fontFamily = "sans-serif";
  }

  // ===== 文字間隔（JR風） =====
  if (data.font === "jr") {
    typeEl.style.letterSpacing = "0.2em";
  } else {
    typeEl.style.letterSpacing = "normal";
  }

  console.log("Firebaseデータ:", data);
});