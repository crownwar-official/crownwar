import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const newsList = document.getElementById("newsList");

async function loadNews() {

  newsList.innerHTML = "";

  const q = query(
    collection(db, "news"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {

    const data = doc.data();

    const date = data.createdAt
      ? data.createdAt.toDate().toLocaleDateString("ja-JP")
      : "";

    newsList.innerHTML += `
      <div class="news-card">
        <div class="news-header">
          <span class="news-category">${data.category}</span>
          <span>${date}</span>
        </div>

        <h3>${data.title}</h3>

        <p>${data.content}</p>
      </div>
    `;
  });

}

loadNews();