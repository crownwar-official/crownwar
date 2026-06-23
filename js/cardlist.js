let cards = [];

const cardList = document.getElementById("cardList");

let currentFaction = "all";
let currentType = "all";
let currentRarity = "all";
let currentCost = "all";

Promise.all([
  fetch("cards/kings.json").then(res => res.json()),
  fetch("cards/royal.json").then(res => res.json()),
  fetch("cards/necro.json").then(res => res.json()),
  fetch("cards/neutral.json").then(res => res.json())
])
.then(([kings, royal, necro, neutral]) => {
  cards = [
    ...kings,
    ...royal,
    ...necro,
    ...neutral
  ];

  applyFilters();
});

function getFactionName(card) {
  if (card.faction === "Royal" && card.subFaction === "Flag") return "ロイヤル・旗";
  if (card.faction === "Royal") return "ロイヤル";
  if (card.faction === "Necro" && card.subFaction === "Mei") return "ネクロ・冥";
  if (card.faction === "Necro") return "ネクロ";
  if (card.faction === "Neutral") return "ニュートラル";
  return card.faction;
}

function getTypeName(card) {
  if (card.type === "King") return "王";
  if (card.type === "Unit") return "ユニット";
  if (card.type === "Spell") return "呪文";
  if (card.type === "Weapon") return "武器";
  return card.type;
}

function renderCards(list) {
  cardList.innerHTML = "";

  document.getElementById("cardCount").textContent =
    `${list.length}枚`;

  list
    .slice()
    .sort((a, b) => {
      if (a.type === "King") return -1;
      if (b.type === "King") return 1;
      return Number(a.cost || 0) - Number(b.cost || 0);
    })
    .forEach(card => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${card.name}</h3>
        <p>${getFactionName(card)} / ${getTypeName(card)}</p>
        ${
  card.type === "King"
    ? `<p>HP：${card.hp}</p>`
    : `<p>コスト：${card.cost ?? "-"}　攻撃：${card.atk ?? "-"}　HP：${card.hp ?? "-"}</p>`
}
        <p>${card.text.replace(/\n/g, "<br>")}</p>
      `;

      div.onclick = () => {
        showCard(card);
      };

      cardList.appendChild(div);
    });
}

function applyFilters() {
  renderCards(
    cards.filter(card => {
      if (currentFaction === "Royal" && card.faction !== "Royal") return false;

      if (
        currentFaction === "Flag" &&
        !(card.faction === "Royal" && card.subFaction === "Flag")
      ) return false;

      if (currentFaction === "Necro" && card.faction !== "Necro") return false;

      if (
        currentFaction === "Mei" &&
        !(card.faction === "Necro" && card.subFaction === "Mei")
      ) return false;

      if (currentFaction === "Neutral" && card.faction !== "Neutral") return false;

      if (currentType !== "all" && card.type !== currentType) return false;

      if (currentRarity !== "all" && card.rarity !== currentRarity) return false;

      if (currentCost !== "all" && Number(card.cost) !== currentCost) return false;

      return true;
    })
  );
}

function filterCards(faction) {
  currentFaction = faction;
  applyFilters();
}

function filterType(type) {
  currentType = type;
  applyFilters();
}

function filterRarity(rarity) {
  currentRarity = rarity;
  applyFilters();
}

function filterCost(cost) {
  currentCost = cost;
  applyFilters();
}

function searchCards() {
  const keyword =
    document.getElementById("cardSearch")
      .value
      .toLowerCase();

  renderCards(
    cards.filter(card =>
      (
        card.name +
        " " +
        (card.search || "") +
        " " +
        (card.text || "")
      )
        .toLowerCase()
        .includes(keyword)
    )
  );
}

function showCard(card) {
  document.getElementById("popupName").textContent = card.name;

  document.getElementById("popupInfo").textContent =
    `${getFactionName(card)} / ${getTypeName(card)}`;

  document.getElementById("popupStats").textContent =
    card.type === "King"
  ? `HP:${card.hp}`
  : `コスト:${card.cost ?? "-"} 攻撃:${card.atk ?? "-"} HP:${card.hp ?? "-"}`;

  document.getElementById("popupText").innerHTML =
  card.text.replace(/\n/g, "<br>");

  document.getElementById("cardPopup").style.display = "flex";
}

function closeCard() {
  document.getElementById("cardPopup").style.display = "none";
}

function toggleFilters() {
  const area = document.getElementById("filterArea");

  if (area.style.display === "none") {
    area.style.display = "block";
  } else {
    area.style.display = "none";
  }
}

function setActiveButton(button) {
  const parent = button.parentElement;

  parent
    .querySelectorAll("button")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");
}