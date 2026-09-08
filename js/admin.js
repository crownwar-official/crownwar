import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loginButton = document.getElementById("loginButton");
const publishButton = document.getElementById("publish");

loginButton.onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .catch(() => {
      alert("ログインに失敗しました");
    });
};

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  document.getElementById("adminPanel").style.display = "block";

  loginButton.style.display = "none";
  document.getElementById("email").style.display = "none";
  document.getElementById("password").style.display = "none";
});

publishButton.onclick = async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("タイトルと内容を入力してください");
    return;
  }

  try {
    await addDoc(collection(db, "news"), {
      category: "更新",
      title: title,
      content: content,
      createdAt: serverTimestamp()
    });

    alert("お知らせを公開しました！");

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
  } catch (e) {
    console.error(e);
    alert("保存に失敗しました");
  }
};