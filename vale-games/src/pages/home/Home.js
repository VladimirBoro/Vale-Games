import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import image from "./background.png";

const Home = () => {
    const URL = process.env.REACT_APP_SERVER_URL;

    return (
        <div className={styles.page}>
            <ul className={styles.gamesDisplay}>
                <li>
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/snake">Snake</Link>
                    </div>    
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/minesweeper">Minesweeper</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/frogger">Frogger</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/cardmatch">Cardmatch</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/birdyflap">Birdy Flap</Link>
                    </div>
                </li>    
                <li>    
                    <div className={styles.gameSelection}>
                        <a href="/game/frogger" className={styles.anchor}>
                            <img src={image} className={styles.homeImage} alt="dope ass pic"/>
                        </a>
                        <Link to="/game/birdyflap">Birdy Flap</Link>
                    </div>
                </li>    
            
            </ul>
        </div>
    )
};

export default Home;