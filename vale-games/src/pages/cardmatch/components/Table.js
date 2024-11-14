import React, { useEffect, useRef, useState } from "react";
import { CardObject } from "../util/card"
import Card from "./Card";
import tablecss from "../styles/table.module.css";

function Table({ difficulty, gameEnded, gameStarted, reset, disable, loseLife, startGame, matchFound }) {
    const [cardOne, setCardOne] = useState(null);
    const [cardTwo, setCardTwo] = useState(null);
    const [lives, setLives] = useState(difficulty.lives);
    const [matches, setMatches] = useState(difficulty.pairs);
    
    const disabled = useRef(false);
    const table = useRef([]);

    useEffect(() => {
        initGame();
    }, [])

    useEffect(() => {
        if (reset) {
            initGame();
        }
    }, [reset])

    useEffect(() => {
        if (disable) {
            disabled.current = true;
        }
        else {
            disabled.current = false;
        }

    }, [difficulty, disable])

    // Check selected cards for a match
    useEffect(() => {
        if (cardOne && cardTwo) {
            setTimeout(checkMatch, 750);
        }
    }, [cardOne, cardTwo]);

    const initGame = () => {
        createTable(difficulty.pairs);
        shuffleTable(table.current);
        setLives(difficulty.lives);
        setMatches(difficulty.pairs);
    }

    const createTable = (pairs) => {
        let newTable = [];
        let currentValue = 1;

        for (let i = 0; i < (pairs * 2); i++) {
            newTable[i] = new CardObject(i, currentValue++, false, false);
            currentValue %= pairs;
        }

        table.current = newTable;
    }

    const shuffleTable = (unshuffledTable) => {
        let randomCardIndex;

        const numCards = unshuffledTable.length;

        for (let i = 0; i < numCards; i++) {
            randomCardIndex = Math.floor(Math.random() * numCards);

            let temp = unshuffledTable[i];
            unshuffledTable[i] = unshuffledTable[randomCardIndex];
            unshuffledTable[randomCardIndex] = temp; 
        } 
    }

    const findCardIndex = (id) => {
        const tableLength = table.current.length;
        for (let i = 0; i < tableLength; i++) {
            if (table.current[i].id == id) {
                return i;
            }
        }

        return -1;
    }

    const checkMatch = () => {
        let cardOneIndex = findCardIndex(cardOne.id);
        let cardTwoIndex = findCardIndex(cardTwo.id);
        disabled.current = false;
        
        if (cardOne.value === cardTwo.value) {
            table.current[cardOneIndex].matched = true;
            table.current[cardTwoIndex].matched = true;
            matchFound();
            setMatches(prev => prev - 1);
        }
        else {
            table.current[cardOneIndex].revealed = false;
            table.current[cardTwoIndex].revealed = false;
            loseLife();
            setLives(prev => prev - 1);
        }
        
        setCardOne(null);
        setCardTwo(null);
    }

    const flipCard = (card) => {
        if (disable) {
            return;
        }

        // Start game if not started already
        if (!gameStarted) {
            startGame();
        }

        const cardIndex = findCardIndex(card.id);
        
        card.revealed = true;
        table.current[cardIndex] = card;

        if (cardOne === null) {
            setCardOne(card);
        }
        else if (cardTwo === null) {
            setCardTwo(card);
            disabled.current = true;
        }        
    }

    return (
        <div className={`${tablecss.table} ${difficulty.string === "Hard" ? `${tablecss.large}` : ""}`}>
            {table.current.map((card, index1) => {
                return <Card data={card} flipCard={flipCard} disabled={disabled.current} gameEnded={gameEnded} reset={reset} key={index1} />
            })}
        </div>
    );
}

export default Table;