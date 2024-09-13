import React from "react";
import gameOver from "./gameOver.module.css"

function GameOver({lost, metric, value, tryAgain}) {
    return (
        <div className={gameOver.window}>
            { lost ? (
                <h2>Game Over!</h2>
            ) : (
                <h2>You Win!</h2>
            )}
            <p>{metric}: {value}</p>
            <button onClick={tryAgain}>Try Again</button>
        </div>
    );
}

export default GameOver;