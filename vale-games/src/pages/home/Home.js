import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import snakeImage from "./images/snake.png";
import minesweeperImage from "./images/minesweeper.png";
import froggerImage from "./images/frogger.png";
import cardmatchImage from "./images/cardmatch.png";
import birdyFlapImage from "./images/birdyflap.png";
import jumpGuyImage from "./images/jumpguy.png";

const Home = () => {
    const URL = process.env.REACT_APP_SERVER_URL;

    return (
        <div className={styles.page}>
            <ul className={styles.gamesDisplay}>
                <li>
                    <div className={styles.gameSelection}>
                        <a href="/game/snake" className={styles.anchor}>
                            <img src={snakeImage} className={styles.homeImage} alt="snake game screenshot"/>
                        </a>
                        <Link to="/game/snake">Snake</Link>
                    </div>    
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/minesweeper" className={styles.anchor}>
                            <img src={minesweeperImage} className={styles.homeImage} alt="minesweeper game screenshot"/>
                        </a>
                        <Link to="/game/minesweeper">Minesweeper</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={froggerImage} className={styles.homeImage} alt="frogger game screenshot"/>
                        </a>
                        <Link to="/game/frogger">Frogger</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/cardmatch" className={styles.anchor}>
                            <img src={cardmatchImage} className={styles.homeImage} alt="cardmatch game screenshot"/>
                        </a>
                        <Link to="/game/cardmatch">Cardmatch</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/birdyflap" className={styles.anchor}>
                            <img src={birdyFlapImage} className={styles.homeImage} alt="birdyflap game screenshot"/>
                        </a>
                        <Link to="/game/birdyflap">Batty Flap</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/jumpguy" className={styles.anchor}>
                            <img src={jumpGuyImage} className={styles.homeImage} alt="jump guy game screenshot"/>
                        </a>
                        <Link to="/game/jumpguy">Jump Guy</Link>
                    </div>
                </li>    
            
            </ul>
        </div>
    )
};

export default Home;