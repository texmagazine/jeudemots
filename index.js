// --- LISTES DES PHRASES ET INDICES ---
const phrases = [
  "AUJOURD'HUI IL Y A DU SOLEIL ET IL FAIT CHAUD",
  "JEAN-BAPTISTE POQUELIN EST NE A L'AGE DE SEPT ANS",
  "LE LANGAGE PYTHON C'EST NUL",
  "SERGE SE COUCHE TOUJOURS TRES TARD",
  "LE MALADE IMAGINAIRE EST UNE PIECE DE THEATRE DE MOLIERE",
  "LE BON ROI DAGOBERT A MIS SA CULOTTE A L'ENVERS"
];

const indicesPhrases = [
  "Cette phrase parle de la météo.",
  "Cette phrase a un rapport avec Molière.",
  "Cette phrase parle d’un langage de programmation.",
  "Cette phrase parle d’un personnage spécial.",
  "Cette phrase concerne une œuvre de Molière.",
  "Cette phrase concerne un roi étourdi."
];

// --- LISTE DES MOTS ---
const mots = [
  "CHAT",
  "BRETAGNE",
  "ORDINATEUR",
  "ANNE-GAELLE",
  "SYLVANIAN",
  "PARIS"
];

const indicesMots = [
  "Un animal",
  "La plus belle région de France.",
  "Un gros truc qui ressemble à une télévision et que Serge aime beaucoup utiliser",
  "Une maman très célèbre",
  "C'EST LE NOM DE PETITS PERSONNAGES QUE EDEN AIME BIEN",
  "C'est la capitale de la France"
];

// --- INDEX SEQUENTIELS ---
let indexPhrase = 0;
let indexMot = 0;

// --- VARIABLES GLOBALES ---
let mode = ""; 
let phraseSecrete = "";
let indiceSecrete = "";
let affichage = "";

// --- SONS ---
const sonCorrect = new Audio("son/sonlettre.mp3");
const sonBravo = new Audio("son/bravo.mp3");
const sonIncorrect = new Audio("son/pasbon.mp3");


// --- ELEMENTS HTML ---
const menu = document.getElementById("menu");
const container = document.getElementById("container");

const btnPhrases = document.getElementById("btn-phrases");
const btnMots = document.getElementById("btn-mots");

const phraseDiv = document.getElementById("phrase");
const lettresDiv = document.getElementById("lettres");
const messageDiv = document.getElementById("message");
const indiceDiv = document.getElementById("indice");
const titreJeu = document.getElementById("titre-jeu");
const instructions = document.getElementById("instructions");

const btnNouvellePartie = document.getElementById("nouvelle-partie");
const btnRetour = document.getElementById("retour-menu");

// --- CHOIX DU MODE ---
btnPhrases.onclick = () => lancerMode("phrases");
btnMots.onclick = () => lancerMode("mots");

function lancerMode(type) {
  mode = type;

  menu.style.display = "none";
  container.style.display = "block";

  if (mode === "phrases") {
    titreJeu.textContent = "Jeu de phrase à découvrir";
    instructions.textContent = "Choisis une lettre. Si elle est dans la phrase, elle s’affiche.";
  } else {
    titreJeu.textContent = "Jeu de mot à trouver";
    instructions.textContent = "Devine le mot en choisissant des lettres.";
  }

  nouvellePartie();
}

// --- RETOUR AU MENU ---
btnRetour.onclick = () => {
  mode = "";
  phraseSecrete = "";
  indiceSecrete = "";
  affichage = "";

  indexPhrase = 0;
  indexMot = 0;

  phraseDiv.innerHTML = "";
  lettresDiv.innerHTML = "";
  messageDiv.textContent = "";
  indiceDiv.textContent = "";
  titreJeu.textContent = "";
  instructions.textContent = "";

  container.style.display = "none";
  menu.style.display = "block";
};

// --- CHOISIR LA PHRASE OU LE MOT ---
function choisirPhraseAleatoire() {
  if (mode === "phrases") {
    phraseSecrete = phrases[indexPhrase];
    indiceSecrete = indicesPhrases[indexPhrase];
    indexPhrase = (indexPhrase + 1) % phrases.length;
  } else {
    phraseSecrete = mots[indexMot];
    indiceSecrete = indicesMots[indexMot];
    indexMot = (indexMot + 1) % mots.length;
  }
}

// --- INITIALISATION ---
function initialiserAffichage() {
  affichage = phraseSecrete.replace(/[A-Z]/g, "_");
  afficherPhrase();
  messageDiv.textContent = "";
  indiceDiv.textContent = "Indice : " + indiceSecrete;
}

// --- AFFICHAGE DE LA PHRASE ---
function afficherPhrase() {
  phraseDiv.innerHTML = "";

  for (let i = 0; i < affichage.length; i++) {

    if (phraseSecrete[i] === " ") {
      const span = document.createElement("span");
      span.className = "espace-large";
      phraseDiv.appendChild(span);
      continue;
    }

    const span = document.createElement("span");
    span.className = "case";

    if (affichage[i] !== "_") {
      span.textContent = affichage[i];
      span.classList.add("revelee");
    }

    phraseDiv.appendChild(span);
  }
}

// --- GENERATION DU CLAVIER ---
function genererClavier() {
  lettresDiv.innerHTML = "";

  for (let i = 65; i <= 90; i++) {
    const lettre = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = lettre;
    btn.className = "lettre";
    btn.onclick = () => choisirLettre(lettre, btn);
    lettresDiv.appendChild(btn);
  }
}

// --- CHOIX D'UNE LETTRE ---
function choisirLettre(lettre, bouton) {
  bouton.disabled = true;

  let nouvelleAffichage = "";
  let trouve = false;

  for (let i = 0; i < phraseSecrete.length; i++) {
    if (phraseSecrete[i] === lettre) {
      nouvelleAffichage += lettre;
      trouve = true;
    } else {
      nouvelleAffichage += affichage[i];
    }
  }

  affichage = nouvelleAffichage;
  afficherPhrase();

if (trouve) {
    messageDiv.textContent = "Lettre trouvée !";
    sonCorrect.currentTime = 0;
    sonCorrect.play();
} else {
    messageDiv.textContent = "Raté… essaie une autre lettre.";
    sonIncorrect.currentTime = 0;
    sonIncorrect.play();   // 🔊 son “pas bon”
}

  // --- FIN DU JEU ---
  if (affichage === phraseSecrete) {
    messageDiv.textContent = "BRAVO !";

    // Animation zoom
    messageDiv.classList.remove("zoom");
    void messageDiv.offsetWidth;
    messageDiv.classList.add("zoom");

    // Son final
    sonBravo.currentTime = 0;
    sonBravo.play();

    desactiverClavier();
  }
}

// --- DESACTIVER LE CLAVIER ---
function desactiverClavier() {
  const boutons = lettresDiv.querySelectorAll("button.lettre");
  boutons.forEach(b => b.disabled = true);
}

// --- NOUVELLE PARTIE ---
function nouvellePartie() {
  choisirPhraseAleatoire();
  initialiserAffichage();
  genererClavier();
}

btnNouvellePartie.addEventListener("click", nouvellePartie);
