import React from "react";

function StartButton({gameStarted, startGame}) {
    return (
        <div style={{ visibility: gameStarted ? "hidden" : "visible" }}>
            <button onClick={startGame}>Start</button>
        </div>
    );
}

export default StartButton;