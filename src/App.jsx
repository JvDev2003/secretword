import './App.css'

import { useCallback, useEffect, useState } from 'react'

import {wordsList} from './data/words'

import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore]= useState(0)

  // pick word and pick category
  const pickWordAndCategory = useCallback(() => {

    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]

    //console.log(categorie)

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    //console.log(word)

    return {word, category}
  },[words])


  // starts the secret word game
  const startGame = useCallback(() => {
    //pick a word and a category
    const {word, category} = pickWordAndCategory()
   
    //clear states
    clearLetterStates()

    //create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map(e => e.toLowerCase());

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    //check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter)){
      return;
    }
    if(wrongLetters.includes(normalizedLetter)){
      return;
    }

    // push guessed letter or remove a guess

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters, normalizedLetter
        ]
      )
    }else{
      setWrongLetters((actualWrongLetters)=>[
          ...actualWrongLetters, normalizedLetter
        ]
      )

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //check if guesses end
  useEffect(() => {
    //reset all states
    if(guesses <= 0){
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(()=>{
    const uniqueLetters = [... new Set(letters)]

    if((guessedLetters.length === uniqueLetters.length) && (guessedLetters.length > 0)){
      // add Score
      setScore((actualScore) => actualScore + 100)

      //restart game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // restart the game
  const retry = () => {
    setScore(0)
    setGuesses(3)

    setGameStage(stages[0].name)
  }



  return (
    <div className='app'>
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game 
                                  verifyLetter={verifyLetter}
                                  pickedWord={pickedWord}
                                  pickedCategory={pickedCategory}
                                  letters={letters}
                                  guessedLetters={guessedLetters}
                                  wrongLetters={wrongLetters}
                                  guesses={guesses}
                                  score={score}
                              />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App
