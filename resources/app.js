Neutralino.init({
  load: () => {
      // Neutralino is loaded and ready to use
  }
});

document.addEventListener('DOMContentLoaded', () => {
  var jsConfetti = new JSConfetti()

  //list all card options
  const cardArray = [
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' },
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' }
  ];

  //attempt to preload all images to add them to cache for instant display when needed
  //sometimes images wont load fast enough due to browser engine optimisation. Not much we can do
  function preloadImagesFromCardArray(cards) {
    for (var i = 0; i < cards.length; i++) {
      var img = new Image();
      img.src = cards[i].img;
    }
  }

  //starting the timer logic to capture play time
  function startTimer() {
    timerInterval = setInterval(() => {
      elapsedTime++;
      updateTimerDisplay();
    }, 1000); // Update timer every second
  }

  //stop timer by clearing the interval
  function stopTimer() {
    clearInterval(timerInterval);
  }

  //display time on the UI
  function updateTimerDisplay() {
    const timerDisplay = document.querySelector('#timer');
    timerDisplay.textContent = formatTime(elapsedTime);
  }

  //format helper function to format the time
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}min ${remainingSeconds.toString().padStart(2, '0')}sec`;
  }


  //init
  cardArray.sort(() => 0.5 - Math.random())
  const grid = document.querySelector('.grid')
  const resultDisplay = document.querySelector('#result')

  //game card arrays
  let cardsChosen = []
  let cardsChosenId = []
  let cardsWon = []

  let timerStarted = false; // Flag to track if the timer has started
  let timerInterval;
  let elapsedTime = 0; // Elapsed time in seconds


  //create your board
  function createBoard() {
    preloadImagesFromCardArray(cardArray);
    for (let i = 0; i < cardArray.length; i++) {
      //create divs for image to be stored
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-id', i);
      card.addEventListener('click', flipCard);

      //create img elements
      const img = document.createElement('img');
      img.setAttribute('src', 'images/blank.png'); // Set initial image as blank
      img.setAttribute('data-id', i); // Set data-id for reference
      card.appendChild(img);
      grid.appendChild(card);

      resultDisplay.textContent = cardsWon.length
    }
  }

  function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.addEventListener('click', restartGame);
    document.body.appendChild(restartButton);
  }

  function createExitButton() {
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit Game';
    exitButton.addEventListener('click', exitGame);
    document.body.appendChild(exitButton);
  }

  function restartGame() {
    location.reload(); // Refresh the page
  }

  function exitGame() {
    Neutralino.app.exit(); // Exit NeutralinoJS application
  }

  //check for matches
  function checkForMatch() {
    const cards = document.querySelectorAll('img')
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]

    //if 0th or 1st element null no need to go through logic
    if (optionOneId == null) return;
    if (optionTwoId == null) return;

    //adding for edge case that image is clicked twice
    if (optionOneId == optionTwoId) {
      cards[optionOneId].setAttribute('src', 'images/blank.png')
      cards[optionTwoId].setAttribute('src', 'images/blank.png')
    }
    //most common path through here. Generic match
    else if (cardsChosen[0] === cardsChosen[1]) {
      jsConfetti.addConfetti(); // throw confetti
      const sound = document.getElementById('yaysoundEffect');
      sound.play(); //play yay sound effect
      cards[optionOneId].setAttribute('src', 'images/white.png')
      cards[optionTwoId].setAttribute('src', 'images/white.png')
      cards[optionOneId].removeEventListener('click', flipCard)
      cards[optionTwoId].removeEventListener('click', flipCard)
      cardsWon.push(cardsChosen)

    }
    //will pass through here if cards dont match 
    else {
      setTimeout(() => {
        cards[optionOneId].classList.remove('flip');
        cards[optionTwoId].classList.remove('flip');
        cards[optionOneId].setAttribute('src', 'images/blank.png')
        cards[optionTwoId].setAttribute('src', 'images/blank.png')
      }, 250);

      const sound = document.getElementById('wrongsoundEffect');
      sound.play(); //play 'wrong' sound effect
    }
    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length
    if (cardsWon.length === cardArray.length / 2) {
      resultDisplay.textContent = 'Congratulations! You found them all! \n You took ' + formatTime(elapsedTime);
      stopTimer(); //stop timer
      //create end game buttons
      createRestartButton();
      createExitButton();

      //throw confetti until the end of time
      setInterval(() => {
        jsConfetti.addConfetti({
          emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
          confettiRadius: 3,
          confettiNumber: 80,
       })
    }, 2000);
    }
  }

  //flip your card
  function flipCard() {
    if (!timerStarted) { //start timer but only once
      startTimer();
      timerStarted = true;
    }

    //only continue with logic if the selected array has less that two (should always be the case)
    if (cardsChosen.length <= 2) {
      const cardId = this.getAttribute('data-id');
      const img = this.querySelector('img');

      // If card is already flipped or matched, do nothing
      if (img.getAttribute('src') !== 'images/blank.png') return;

      // Apply the flip animation class after a delay
      img.classList.add('flip');

      // After 0.25s, change the image
      setTimeout(() => {
        img.setAttribute('src', cardArray[cardId].img);
      }, 250); 

      //after 0.5s push and check for selected card
      setTimeout(() => {
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);
        checkForMatch();
      }, 500);
    }
  }

  createBoard()
})