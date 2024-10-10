import words from './utils/words.js'

function _getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// get DOM elements
const wordEl = document.querySelector('#word-guess')
const inputEl = document.querySelector('#word-input')
const timeEl = document.querySelector('#time')
const difficultyEl = document.querySelector('#difficulty')
const bestScoreEl = document.querySelector('#best-score')
const wordCountEl = document.querySelector('#word-count')
const modal = document.querySelector('#start-game-prompt')
const modalP = document.querySelector('#start-game-prompt p')

const scores = JSON.parse(localStorage.getItem('scores')) || [0]
const difficulties = ['Easy', 'Moderate', 'Hard']

let interval = null
let timeSeconds = 10
let difficulty = _getRandomFromArray(difficulties)
let wordCount = 0
let wordToGuess
let nthLetter = 1
let wordInputCorrect = ''

function updateTime() {
  timeEl.innerText = timeSeconds
}

function updateWord() {
  wordEl.innerHTML = ''
  nthLetter = 1

  for (let i = 0; i < wordToGuess.length; i++) {
    const letter = wordToGuess[i]
    const span = document.createElement('span')
    span.innerText = letter
    span.id = 'letter-' + (i + 1)
    wordEl.appendChild(span)
  }
}

function updateDifficulty() {
  difficultyEl.innerText = 'Difficulty: ' + difficulty
}

function updateWordCount() {
  wordCountEl.innerText = 'Word count: ' + wordCount
}

function resetInterval() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

function reset() {
  wordCount = 0
  timeSeconds = 11
  nthLetter = 1
  difficulty = 'Easy'
  updateWordCount()
}

function lose() {
  resetInterval()

  modal.style.display = 'block'
  modalP.innerText = 'Your score is ' + wordCount + '\nPress ENTER to continue'

  inputEl.value = ''

  if (!scores.includes(wordCount)) {
    scores.push(wordCount)
  }

  reset()

  localStorage.setItem('scores', JSON.stringify(scores))
}

function startTime() {
  function countdown() {
    timeSeconds--
    updateTime()

    if (timeSeconds <= 0) {
      lose()
    }
  }

  interval = setInterval(countdown, 1000)
}

function nextWord() {
  wordCount++
  updateWordCount()
  resetInterval()

  inputEl.value = ''

  difficulty = _getRandomFromArray(difficulties)

  timeSeconds =
    difficulty === 'Easy'
      ? timeSeconds + 3
      : difficulty === 'Moderate'
      ? timeSeconds + 2
      : timeSeconds + 1

  wordToGuess = _getRandomFromArray(words[difficulty])

  updateDifficulty()
  updateWord()
  startTime()
  updateTime()
}

updateTime()

function startGame() {
  wordToGuess = _getRandomFromArray(words[difficulty])

  bestScoreEl.innerText = 'Best: ' + Math.max(...scores)

  inputEl.value = ''
  inputEl.focus()

  resetInterval()
  updateWord()
  startTime()
  updateDifficulty()
}

inputEl.addEventListener('input', (event) => {
  const wordInput = event.target.value.toLowerCase().trim()
  const letterToGuess = wordToGuess[nthLetter - 1]
  const letterInput = wordInput[nthLetter - 1]

  const span = document.querySelector('#letter-' + nthLetter)
  const prevSpan = document.querySelector('#letter-' + (nthLetter - 1))

  if (event.inputType === 'deleteContentBackward') {
    if (wordToGuess.startsWith(wordInput) && wordInput !== wordInputCorrect) {
      console.info('A correct letter in a proper order was erased')
      wordInputCorrect = wordInputCorrect.slice(0, -1)
      prevSpan.classList.remove('correct')
      nthLetter--
    }
  } else {
    if (letterToGuess == letterInput) {
      try {
        span.classList.add('correct')
      } catch (err) {
        // Do nothing...
        // console.error('Error: ', err)
      }

      nthLetter++
      wordInputCorrect = wordInput
    }
  }

  if (wordInput === wordToGuess.toLowerCase()) {
    nextWord()
  }
})

export default startGame
