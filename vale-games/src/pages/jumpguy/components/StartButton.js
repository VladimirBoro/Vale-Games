import React from "react";

function StartButton({hideButton, startGame}) {
    return (
        <div style={{ visibility: (hideButton) ? "hidden" : "visible" }}>
            <button onClick={startGame}>Start</button>
        </div>
    );
}

export default StartButton;