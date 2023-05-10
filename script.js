import startGame from './javascript/game.js'

;(function () {
  const startModal = document.querySelector('#start-game-prompt')
  startModal.style.display = 'block'

  const startButton = document.querySelector('button#start-game')

  startButton.addEventListener('click', () => {
    startModal.style.display = 'none'
    startGame()

    if (startButton.innerText !== 'Play Again') {
      startButton.innerText = 'Play Again'
    }
  })
})()
