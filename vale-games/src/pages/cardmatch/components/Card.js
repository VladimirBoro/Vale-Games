import React, { useRef } from "react";
import card from "../styles/card.module.css"

function Card({ data, flipCard, disabled, gameEnded, reset }) {
    const cardRef = useRef(null);
    const cardFaceColors = ["#4f3b78", "#2c5d63", "#a21232", "#f5b553", "#000000", "#ff2e63", 
        "#4592af", "#d59bf6", "#d9b650", "#2eb872"];
    
    const flip = () => {
        // prohibit flips under these conditions
        if (data.revealed || data.matched) {
            return;
        }

        console.log("flipper");

        if (!disabled) {
            flipCard(data);
        }
    }

    return(
        <div onClick={flip} className={`${card.card} ${data.revealed ? `${card.is_flipped}` : ""}`} ref={cardRef}>
            <div className={card.card_face}>
                <div style={{backgroundColor: cardFaceColors[data.value]}} className={ `${card.card_face_front} ${reset ? `${card.card_face_front_gameover}` : ""}`} >
                    <p>{data.value}</p>
                </div>
                <div className={`${card.card_face_back}`}></div>

            </div>
        </div>
    )
}

export default Card;