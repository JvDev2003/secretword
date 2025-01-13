import { useState, useRef } from "react"
import styles from "./Game.module.css"

const Game = ({
    verifyLetter,
    pickedWord,
    pickedCategory,
    letters,
    guessedLetters,
    wrongLetters,
    guesses,
    score
}) => {

    const [letter, setLetter] = useState("")
    const letterInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        verifyLetter(letter);

        setLetter("");

        letterInputRef.current.focus();
    }

    return (
        <div className={styles.game}>
            <p className={styles.points}>
                <span>Pontuação: {score}</span>
            </p>
            <h1>Adivinhe a palavra:</h1>
            <h3 className={styles.tip}>
                Dica sobre a sua palavra: <span>{pickedCategory}</span>
            </h3>
            <p>Você ainda tem <span>{guesses}</span> tentativa(s).</p>
            <div className={styles.wordContainer}>
                {
                    letters.map((letter, i) => (
                        guessedLetters.includes(letter) ? (
                            <span key={i} className={styles.letter}>{letter}</span>
                        ):(
                            <span key={i} className={styles.blankSquare}></span>
                        )
                    ))
                }  
            </div>
            <div className={styles.letterContainer}>
                <p>Tente advinhar uma letra da palavra:</p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        name="letter"
                        maxLength="1"
                        required
                        onChange={(e) => setLetter(e.target.value.toUpperCase())}
                        value={letter}
                        ref={letterInputRef}
                    />
                    <button>Jogar!</button>
                </form>
            </div>
            <div className="wrongLettersContainer">
                <p>Letras já utilizadas:</p>
                {
                    wrongLetters.map((letter, i) => (
                        <span key={i}>{letter.toUpperCase()}, </span>
                    ))
                }
            </div>
        </div>
    )
}

export default Game