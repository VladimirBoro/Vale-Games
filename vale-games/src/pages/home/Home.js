import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import image from "./background.png";
import snakeImage from "./images/snake.png";
import minesweeperImage from "./images/minesweeper.png";
import froggerImage from "./images/frogger.png";
import cardmatchImage from "./images/cardmatch.png";
import skyImage from "./images/sky.png";

const Home = () => {
    const URL = process.env.REACT_APP_SERVER_URL;

    return (
        <div className={styles.page}>
            <ul className={styles.gamesDisplay}>
                <li>
                    <div className={styles.gameSelection}>
                        <a href="/game/snake" className={styles.anchor}>
                            <img src={snakeImage} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/snake">Snake</Link>
                    </div>    
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/minesweeper" className={styles.anchor}>
                            <img src={minesweeperImage} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/minesweeper">Minesweeper</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={froggerImage} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/frogger">Frogger</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/cardmatch" className={styles.anchor}>
                            <img src={cardmatchImage} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/cardmatch">Cardmatch</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/birdyflap" className={styles.anchor}>
                            <img src={skyImage} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/birdyflap">Birdy Flap</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/birdyflap" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/birdyflap">Unicorn Dash</Link>
                    </div>
                </li>    
            
            </ul>
        </div>
    )
};

export default Home;