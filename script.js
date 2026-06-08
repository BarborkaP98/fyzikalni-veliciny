let balicek = [];
let vybranaKarta = null;
let tazenaKarta = null;

// ✅ DATA
let veliciny = [
  { nazev: "rychlost", znacka: "v", jednotka: "m/s (metr za sekundu)", meridlo: "tachometr" },
  { nazev: "hmotnost", znacka: "m", jednotka: "kg (kilogram)", meridlo: "váhy" },
  { nazev: "čas", znacka: "t", jednotka: "s (sekunda)", meridlo: "stopky" },
  { nazev: "teplota", znacka: "T", jednotka: "°C (stupeň Celsia)", meridlo: "teploměr" },
  { nazev: "síla", znacka: "F", jednotka: "N (newton)", meridlo: "siloměr" },
  { nazev: "hustota", znacka: "ρ", jednotka: "kg/m³ (kilogram na metr krychlový)", meridlo: "hustoměr" },
  { nazev: "délka", znacka: "l", jednotka: "m (metr)", meridlo: "pravítko" },
  { nazev: "elektrický proud", znacka: "I", jednotka: "A (ampér)", meridlo: "ampérmetr" }
];

// ✅ GENEROVÁNÍ
function generuj() {
  balicek = [];

  let vybrane = [];

  while (vybrane.length < 5) {
    let r = veliciny[Math.floor(Math.random() * veliciny.length)];
    if (!vybrane.includes(r)) vybrane.push(r);
  }

  vybrane.forEach(function (v) {
    balicek.push({ text: v.nazev, skupina: v.nazev });
    balicek.push({ text: v.znacka, skupina: v.nazev });
    balicek.push({ text: v.jednotka, skupina: v.nazev });
    balicek.push({ text: v.meridlo, skupina: v.nazev });
  });

  balicek.sort(() => Math.random() - 0.5);
}

// ✅ KARTA
function vytvorKartu(text, skupina) {
  let karta = document.createElement("div");
  karta.className = "karta";
  karta.innerText = text;
  karta.dataset.s = skupina;
  karta.draggable = true; // ✅ zapnutí drag

  // klik výběr
  karta.addEventListener("click", function () {
    vybranaKarta = karta;
  });

  // drag start
  karta.addEventListener("dragstart", function () {
    tazenaKarta = karta;
  });

  return karta;
}

// ✅ LÍZNUTÍ
function lizniKartu() {
  let zona = document.getElementById("aktualni-karta");

  if (balicek.length === 0) {
    zona.innerHTML = "<b>Konec hry ✅</b>";
    return;
  }

  let k = balicek.pop();

  zona.innerHTML = "";
  zona.appendChild(vytvorKartu(k.text, k.skupina));
}

// ✅ PŘESUN
function presunKartu(sloupec, karta) {

  let puvodni = karta.parentElement;

  if (puvodni && puvodni.classList.contains("sloupec")) {
    let karty = puvodni.querySelectorAll(".karta");

    if (karty.length === 1) {
      puvodni.innerHTML = "";
    } else {
      karta.remove();
    }
  }

  if (sloupec.querySelectorAll(".karta").length === 0) {
    let nadpis = document.createElement("div");
    nadpis.innerText = karta.dataset.s;
    nadpis.style.fontWeight = "bold";
    sloupec.appendChild(nadpis);
  }

  sloupec.appendChild(karta);

  vybranaKarta = null;
  tazenaKarta = null;

  document.getElementById("aktualni-karta").innerHTML = "";
}

// ✅ INIT
document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {

    // klikání (zůstává)
    sloupec.addEventListener("click", function () {
      if (!vybranaKarta) return;
      presunKartu(sloupec, vybranaKarta);
    });

    // ✅ povolení dropu
    sloupec.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    // ✅ drop
    sloupec.addEventListener("drop", function (e) {
      e.preventDefault();
      if (!tazenaKarta) return;
      presunKartu(sloupec, tazenaKarta);
    });

  });

  generuj();
});

// ✅ KONTROLA
window.zkontroluj = function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {

    let karty = sloupec.querySelectorAll(".karta");

    if (karty.length === 0) return;

    let skup = karty[0].dataset.s;
    let ok = true;

    karty.forEach(function (k) {
      if (k.dataset.s !== skup) ok = false;
    });

    if (ok && karty.length === 4) {
      sloupec.style.background = "#66bb6a";
    } else {
      sloupec.style.background = "#ffcdd2";
    }

  });
};

// ✅ NOVÁ HRA
window.novaHra = function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {
    sloupec.innerHTML = "";
    sloupec.style.background = "#c8e6c9";
  });

  document.getElementById("aktualni-karta").innerHTML = "";

  generuj();
};
