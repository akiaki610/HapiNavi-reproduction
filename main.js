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

let intervalId = null;

onValue(trainRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // ===== 基本表示 =====
  document.querySelector(".right-top").textContent = data.number || "----";
  document.querySelector(".big").textContent = data.cars || "0";

  // ===== 種別 =====
  const typeEl = document.getElementById("type");
  const typeEnEl = document.getElementById("type-en");

  typeEl.textContent = data.type || "普通";
  typeEnEl.textContent = data.type_en || "Local";

  const color = data.color || "#ccc";
  typeEl.style.color = color;
  typeEnEl.style.color = color;

  if (data.font === "jr") {
    typeEl.style.fontFamily = "JNR";
    typeEnEl.style.fontFamily = "Arial, sans-serif";
    typeEl.style.letterSpacing = "0.2em";
  } else {
    typeEl.style.fontFamily = "sans-serif";
    typeEnEl.style.fontFamily = "sans-serif";
    typeEl.style.letterSpacing = "normal";
  }

  // 🔥 前のinterval削除
  if (intervalId) clearInterval(intervalId);

  // ===== リアルタイム処理 =====
  intervalId = setInterval(() => {

    const now = Math.floor(Date.now() / 1000);
    const startTime = data.startTime || now;
    const elapsed = now - startTime;

    // ===== 距離計算 =====
    const totalTime = 180;      // 全体時間（秒）
    const totalDistance = 100;  // 総距離（km）

    let remaining = totalDistance - (elapsed / totalTime) * totalDistance;
    if (remaining < 0) remaining = 0;

    document.querySelector(".detail").textContent =
      "現在位置: " + remaining.toFixed(1) + "km";

    // ===== 次駅判定 =====
    let nextStation = "終点";

    if (data.stations && data.stations.length > 0) {
      for (let i = 0; i < data.stations.length; i++) {
        if (elapsed < data.stations[i].time) {
          nextStation = data.stations[i].name;
          break;
        }
      }
    }

    document.querySelector(".next-text").textContent =
      "NEXT＞ " + nextStation;

    // ===== 停車判定 =====
    const STOP_TIME = 10; // 秒

    let isStopping = false;

    if (data.stations) {
      for (let s of data.stations) {
        if (elapsed >= s.time && elapsed <= s.time + STOP_TIME) {
          isStopping = true;
        }
      }
    }

    if (isStopping) {
      document.body.classList.add("stopping");
    } else {
      document.body.classList.remove("stopping");
    }

    let intervalId = null;

    onValue(trainRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // ===== 基本 =====
      document.querySelector(".right-top").textContent = data.number || "----";
      document.querySelector(".big").textContent = data.cars || "0";

      const typeEl = document.getElementById("type");
      const typeEnEl = document.getElementById("type-en");

      typeEl.textContent = data.type || "普通";
      typeEnEl.textContent = data.type_en || "Local";

      const color = data.color || "#ccc";
      typeEl.style.color = color;
      typeEnEl.style.color = color;

      if (data.font === "jr") {
        typeEl.style.fontFamily = "JNR";
        typeEnEl.style.fontFamily = "Arial, sans-serif";
        typeEl.style.letterSpacing = "0.2em";
      }

      // 前のinterval削除
      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(() => {

        const now = Math.floor(Date.now() / 1000);
        const elapsed = now - data.startTime;

        // ===== 次駅 =====
        let nextStation = "終点";
        let isStopping = false;

        if (data.stations) {
          for (let s of data.stations) {

            // 停車中判定
            if (elapsed >= s.time && elapsed <= s.time + (s.stopTime || 10)) {
              isStopping = true;
              nextStation = s.name + "（停車中）";
            }

            // 次駅
            if (elapsed < s.time) {
              nextStation = s.name;
              break;
            }
          }
        }

        document.querySelector(".next-text").textContent =
          "NEXT＞ " + nextStation;

        // ===== 停車アニメON/OFF =====
        if (isStopping) {
          document.body.classList.add("stopping");
        } else {
          document.body.classList.remove("stopping");
        }

      }, 1000);

});

  }, 1000);

  console.log("Firebaseデータ:", data);
});