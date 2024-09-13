import React, { useEffect, useRef, useState } from "react";
import card from "../styles/card.module.css"

function Card({ data, flipCard, disabled }) {
    const cardRef = React.useRef(null)
    const cardFaceColors = ["#4f3b78", "#2c5d63", "#a21232", "#f5b553", "#000000", "#ff2e63", 
        "#4592af", "#d59bf6", "#d9b650", "#2eb872"];
    

    const flip = () => {
        if (data.revealed || data.matched) {
            console.log("no flip");
            return;
        }

        // let flipped;
        if (!disabled) {
            flipCard(data);
        }
    }

    return(
        <div onClick={flip} className={`${card.card} ${data.revealed ? `${card.is_flipped}` : ""}`} ref={cardRef}>
            <div className={card.card_face}>
                <div className={`${card.card_face_front}`} style={{backgroundColor: cardFaceColors[data.value]}}>
                    <p>{data.value}</p>
                </div>
                <div className={`${card.card_face_back}`}></div>
            </div>
        </div>
    )
}

export default Card;