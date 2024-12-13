import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import snakeImage from "./images/snake.png";
import minesweeperImage from "./images/minesweeper.png";
import froggerImage from "./images/frogger.png";
import cardmatchImage from "./images/cardmatch.png";
import birdyFlapImage from "./images/birdyflap.png";
import jumpGuyImage from "./images/jumpguy.png";

const Home = () => {
    const games = useRef([
        { id: 1, name: 'Snake', image: snakeImage, path: `${process.env.REACT_APP_SNAKE}`, description: 'A classic snake game!', position: 'leftleft'},
        { id: 2, name: 'Frogger', image: froggerImage, path: `${process.env.REACT_APP_FROGGER}`, description: 'Help the frog cross the road!', position: 'left' },
        { id: 3, name: 'Minesweeper', image: minesweeperImage, path: `${process.env.REACT_APP_MINESWEEPER}`, description: 'Find the safe zones, but look out for mines!', position: 'middle' },
        { id: 4, name: 'Card Match', image: cardmatchImage, path: `${process.env.REACT_APP_CARDMATCH}`, description: 'Match all the pairs cards!', position: 'right' },
        { id: 5, name: 'Flappy Bat', image: birdyFlapImage, path: `${process.env.REACT_APP_FLAPPYBAT}`, description: 'Fly through as many barriers as you can!', position: 'rightright' },
        { id: 6, name: 'Jump Guy', image: jumpGuyImage, path: `${process.env.REACT_APP_JUMPGUY}`, description: 'Jump up the platforms high into the clouds!', position: '' },
    ]);

    const [currentGame, setCurrentGame] = useState(2);
    const [selectingRandom, setSelectingRandom] = useState(false);

    useEffect(() => {
        localStorage.setItem("currentGame", "");
        window.dispatchEvent(new Event("game"));
    }, [])

    const handleRandomClick = () => {
        setSelectingRandom(true);

        const direction = Math.round(Math.random());
        const numOfSkips = Math.round(5 + Math.random() * 10);
        const timePerSkipMillis = 225;

        for(let i = 0; i < numOfSkips; i++) {
            if (direction === 0) {
                setTimeout(handleLeftClick, timePerSkipMillis * i);
            }
            else {
                setTimeout(handleRightClick, timePerSkipMillis * i);
            }
        }

        setTimeout(() => {
            setSelectingRandom(false);
        }, timePerSkipMillis * numOfSkips);
    }

    const handleLeftClick = () => {
        if (selectingRandom) {
            return;
        }

        setCurrentGame((prev) => (prev === 0 ? games.current.length - 1 : prev - 1));

        games.current.forEach(game => {
            switch (game.position) {
                case 'leftleft':
                    game.position = 'left';
                    break;
                case 'left':
                    game.position = 'middle';
                    break;
                case 'middle':
                    game.position = 'right';
                    break;
                case 'right':
                    game.position = 'rightright';
                    break;
                case 'rightright':
                    game.position = '';
                    break;
                default:
                    game.position = 'leftleft';
            }
        });
    };
    
    const handleRightClick = () => {
        if (selectingRandom) {
            return;
        }

        setCurrentGame((prev) => (prev === games.current.length - 1 ? 0 : prev + 1));

        games.current.forEach(game => {
            switch (game.position) {
                case 'leftleft':
                    game.position = '';
                    break;
                case 'left':
                    game.position = 'leftleft';
                    break;
                case 'middle':
                    game.position = 'left';
                    break;
                case 'right':
                    game.position = 'middle';
                    break;
                case 'rightright':
                    game.position = 'right';
                    break;
                default:
                    game.position = 'rightright';
            }
        });
    };

    return (
        <div className={styles.carouselContainer}>
    
            <h1>{games.current[currentGame].name}</h1>
    
            <div className={styles.carousel}>
                {games.current.map((game) => {
                    let component; 

                    if (game.position === '') {
                        return;
                    }
                    else if (game.position === 'left' || game.position === 'right') {
                        // left and right games can be clicked to select them to be middle
                        component = (
                            <Link key={game.id} className={`${styles.middleLink}`}>
                                <img 
                                    className={`${styles.artCover} ${styles[game.position]}`} 
                                    src={game.image} 
                                    alt={game.name} 
                                    onClick={game.position === 'left' ? handleLeftClick : handleRightClick}
                                />
                            </Link>
                        )
                    }
                    else if (game.position === 'middle') {
                        // Contains link to game presented
                        component = (
                            <Link key={game.id} to={games.current[currentGame].path} className={`${styles.middleLink}`}>
                                <img 
                                    className={`${styles.artCover} ${styles[game.position]}`} 
                                    src={game.image} 
                                    alt={game.name}
                                />
                            </Link>
                        )
                    }
                    else {
                        // leftleft or rightright (which are invisible)
                        component = (
                            <Link key={game.id} className={`${styles.middleLink}`}>
                                <img 
                                    className={`${styles.artCover} ${styles[game.position]}`} 
                                    src={game.image} 
                                    alt={game.name} 
                                />
                            </Link>
                        )
                    }

                    return component;
                })}
            </div>

            <div className={styles.description}>
                <p>
                    {games.current[currentGame].description}
                </p>
            </div>

            <div className={styles.buttons}>
                <button className={styles.arrow} onClick={handleLeftClick}>←</button>
                <button className={styles.random} onClick={handleRandomClick}>?</button>
                <button className={styles.arrow} onClick={handleRightClick}>→</button>
            </div>

            <Link to={games.current[currentGame].path} className={styles.playBtn}>
                Play!
            </Link>

        </div>
    );
};

export default Home;