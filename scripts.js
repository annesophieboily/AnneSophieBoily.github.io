const cards = document.querySelectorAll('.memory-card');
const tour = document.getElementById("tour");
const meilleurToursText = document.getElementById("meilleurTours");
const victoireMessage = document.getElementById("victoireMessage");
const recommencerContainer = document.getElementById("recommencerContainer");
const fermer = document.getElementById("fermer");
const jamais = document.getElementById("jamais");
const dialog = document.getElementById("dialog");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let nbMatch = 0;
let tours = 0;
let meilleurTours = 100000000000000;

//Regarde au lancement du site si l'utilisateur à déja cliquer le "ne plus afficher"
//Si non, on lui affiche le dialog
window.onload = function() {

  if (localStorage.getItem('noShowModal') !== 'true') {
    dialog.showModal();
  }

  fermer.onclick = function() {
    dialog.close();
  }

  jamais.onclick = function() {
    localStorage.setItem('noShowModal', 'true');
    dialog.close();
  }

}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

//Ajout du nombre de tour et du nombre de match pour déterminer quand le jeu est fini
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  tours += 1;
  tour.innerText = "Nombre de tour : " + tours;
  isMatch ? disableCards() : unflipCards();
  isMatch ? nbMatch++ : nbMatch;
  if (nbMatch == 6) {
    fin()
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));


//Permet de recommencer le jeu
//Enlève le message de victoire ainsi que le bouton pour recommencer
//Remet le nombre de tour et le nombre de match à 0
//Retourne les cartes et les remélanges
function restart() {
  victoireMessage.style.display = "none";
  recommencerContainer.style.display = "none";
  tours = 0;
  tour.innerText = "Nombre de tour : " + tours;
  nbMatch = 0;
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
  
}


//Permet d'afficher le message de victoire ainsi que le bouton pour recommencer
//Met aussi jour le meilleur nombre de tour s'il est meilleur que l'ancien en mémoire
function fin() {
  victoireMessage.style.display = "block";
  recommencerContainer.style.display = "block";
  if (tours < meilleurTours) {
    meilleurTours = tours;
    meilleurToursText.innerText = "Meilleur nombre de tour : " + meilleurTours;
  }
}