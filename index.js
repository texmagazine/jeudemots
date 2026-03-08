// --- LISTES DES PHRASES ET INDICES ---
const phrases = [
  "AUJOURD'HUI LE SOLEIL BRILLE ET LE CIEL EST BLEU",
  "JEAN-BAPTISTE POQUELIN EST NE A L'AGE DE SEPT ANS",
  "LE LANGAGE PYTHON C'EST NUL",
  "LA REINE DES NEIGES",
  "LE MALADE IMAGINAIRE EST UNE PIECE DE THEATRE DE MOLIERE",
  "LE BON ROI DAGOBERT A MIS SA CULOTTE A L'ENVERS"
];

const indicesPhrases = [
  "Cette phrase parle de la météo.",
  "Cette phrase a un rapport avec Molière.",
  "Cette phrase parle d’un langage de programmation.",
  "Cette phrase est le titre d'un dessin animé",
  "Cette phrase concerne une œuvre de Molière.",
  "Cette phrase concerne un roi étourdi."
];

// --- LISTE DES MOTS ---
const mots = [
  "SINGE",
  "CORSE",
  "ORDINATEUR",
  "PLAYSTATION",
  "ARCHEOLOGIE",
  "TRUMP"
];

const indicesMots = [
  "Un animal",
  "Une très belle région Francaise",
  "Un gros truc qui ressemble à une télévision et que Laurent aime beaucoup utiliser",
  "Un truc blanc qui sert à jouer à des jeux vidéo",
  "C'est ce qui permet de savoir comment vivait les gens avant",
  "C'est un Président pas très Sympa"
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

  let motActuel = document.createElement("span");
  motActuel.className = "mot";

  for (let i = 0; i < affichage.length; i++) {

    if (phraseSecrete[i] === " ") {
      phraseDiv.appendChild(motActuel);
      motActuel = document.createElement("span");
      motActuel.className = "mot";
      continue;
    }

    const span = document.createElement("span");
    span.className = "case";
    span.textContent = affichage[i] === "_" ? "\u00A0" : affichage[i];

    motActuel.appendChild(span);
  }

  phraseDiv.appendChild(motActuel);
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

  if (!trouve) {
    bouton.classList.add("mauvaise");   // ⬅️ LE BOUTON DEVIENT ROUGE
    messageDiv.textContent = "Raté… essaie une autre lettre.";
    sonIncorrect.currentTime = 0;
    sonIncorrect.play();
  } else {
    sonCorrect.currentTime = 0;
    sonCorrect.play();
  }

  if (!affichage.includes("_")) {
    messageDiv.textContent = "BRAVO !";
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
