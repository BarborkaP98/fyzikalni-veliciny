let balicek = [];
let vybranaKarta = null;

// ✅ DATA
let veliciny = [
  { nazev: "rychlost", znacka: "v", jednotka: "m/s", meridlo: "tachometr" },
  { nazev: "hmotnost", znacka: "m", jednotka: "kg", meridlo: "váhy" },
  { nazev: "čas", znacka: "t", jednotka: "s", meridlo: "stopky" },
  { nazev: "teplota", znacka: "T", jednotka: "°C", meridlo: "teploměr" },
  { nazev: "síla", znacka: "F", jednotka: "N", meridlo: "siloměr" }
];

// ✅ GENEROVÁNÍ
function generuj() {
  balicek = [];

  veliciny.forEach(function (v) {
    balicek.push({ text: v.nazev, skupina: v.nazev });
    balicek.push({ text: v.znacka, skupina: v.nazev });
    balicek.push({ text: v.jednotka, skupina: v.nazev });
    balicek.push({ text: v.meridlo, skupina: v.nazev });
  });

  balicek.sort(function () {
    return Math.random() - 0.5;
  });
}

// ✅ KARTA
function vytvorKartu(text, skupina) {
  let karta = document.createElement("div");
  karta.className = "karta";
  karta.innerText = text;
  karta.dataset.s = skupina;

  karta.addEventListener("click", function () {
    vybranaKarta = karta;
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
function presun(sloupec, karta) {

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
  document.getElementById("aktualni-karta").innerHTML = "";
}

// ✅ INIT
document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {

    sloupec.addEventListener("click", function () {
      if (!vybranaKarta) return;

      presunKartu(sloupec, vybranaKarta);
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
