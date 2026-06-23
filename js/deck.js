let cards = [];

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

  renderKingList();
});
const kingList = document.getElementById("kingList");
const deckCardList = document.getElementById("deckCardList");
const deckList = document.getElementById("deckList");
const selectedKingText = document.getElementById("selectedKing");
const deckCountText = document.getElementById("deckCount");

let selectedKing = null;
let deck = [];

function renderKingList() {
  kingList.innerHTML = "";

  cards.filter(card => card.type === "King").forEach(card => {
    const div = createCardDiv(card);
    div.onclick = () => {
      selectedKing = card;
      deck = [];
      selectedKingText.textContent = `王：${card.name}`;
      renderDeckCards();
      renderDeck();
    };
    kingList.appendChild(div);
  });
}

function renderDeckCards() {
  deckCardList.innerHTML = "";

  if (!selectedKing) {
    deckCardList.innerHTML = "<p>先に王を選んでください。</p>";
    return;
  }

  cards
    .filter(card => card.type !== "King")
    .filter(card => card.faction === selectedKing.faction || card.faction === "Neutral")
    .forEach(card => {
      const div = createCardDiv(card);
      div.onclick = () => addCard(card);
      deckCardList.appendChild(div);
    });
}

function addCard(card) {
  if (deck.length >= 60) return;

  const sameCount = deck.filter(c => c.id === card.id).length;
  const limit = card.rarity === "SR" ? 3 : 6;

  if (sameCount >= limit) return;

  deck.push(card);
  renderDeck();
}

function renderDeck() {
  deckList.innerHTML = "";
  deckCountText.textContent = `${deck.length} / 60`;

  const counts = {};
  deck.forEach(card => {
    counts[card.id] = (counts[card.id] || 0) + 1;
  });

  Object.keys(counts).forEach(id => {
    const card = deck.find(c => c.id === id);
    const div = document.createElement("div");
    div.className = "deck-item";
    div.innerHTML = `<span>${card.name}</span><span>×${counts[id]}</span>`;
    deckList.appendChild(div);
  });
}

function createCardDiv(card) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <h3>${card.name}</h3>
    <p>${getFactionName(card)}</p>
    ${
      card.type === "King"
      ? `<p>HP：${card.hp}</p>`
      : `<p>コスト：${card.cost} 攻撃：${card.atk} HP：${card.hp}</p>`
    }
  `;

  return div;
}

function getFactionName(card) {
  if (card.faction === "Royal" && card.subFaction === "Flag") {
    return "ロイヤル・旗";
  }

  if (card.faction === "Royal") {
    return "ロイヤル";
  }

  if (card.faction === "Necro" && card.subFaction === "Mei") {
    return "ネクロ・冥";
  }

  if (card.faction === "Necro") {
    return "ネクロ";
  }

  if (card.faction === "Neutral") {
    return "ニュートラル";
  }

  return card.faction;
}