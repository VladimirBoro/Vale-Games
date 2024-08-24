import React from "react";
import { Link } from "react-router-dom";
import home from "./home.module.css"
import customAxios from "../../util/customAxios"

const Home = () => {
    const URL = process.env.REACT_APP_SERVER_URL;


    const test = () => {
        customAxios.get(URL + "/minesweeper/scores",
            {
                withCredentials: true
            }
        )
        .then(response => {
            console.log(response);
        })
    };

    return (
        <div>
            <h1>Welcome to Vale Games!</h1>
            <ul className={home.gamesDisplay}>
                <li>    
                    <Link to="/game/snake">Snake</Link>
                </li>    
                <li>    
                    <Link to="/game/minesweeper">Minesweeper</Link>
                </li>    
                <li>    
                    <Link to="/game/frogger">Frogger</Link>
                </li>    
                <li>    
                    <Link to="/game/cardmatch">Cardmatch</Link>
                </li>    
                <li>    
                    <Link to="/game/birdyflap">Birdy Flap</Link>
                </li>    
                <li>    
                    <Link to="/game/birdyflap">Birdy Flap</Link>
                </li>    
            
            </ul>
            
            <button onClick={test}>testing...</button>
        </div>
    )
};

export default Home;