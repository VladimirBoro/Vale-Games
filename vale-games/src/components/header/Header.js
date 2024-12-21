import React, { useState, useEffect } from "react";
import { fetchProfilePic } from "../../util/restful";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import customAxios from '../../util/customAxios';
import styles from "./header.module.css"

const Header = ({toggleLoginOverlay}) => {
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));
    const [gameTitle, setGameTitle] = useState(localStorage.getItem("currentGame"));
    
    const LOGOUT_EXTENSTION = process.env.REACT_APP_LOGOUT_PATH;
    const navigate = useNavigate(); 

    // event listener for when to get profile pic image from server
    useEffect(() => {
        const handleProfilePicChange = async () => {
            setProfilePic(await fetchProfilePic(localStorage.getItem("user")));
        };

        if (user !== null) {
            handleProfilePicChange();
        }
        
        window.addEventListener("profilePic", handleProfilePicChange);

        return () => {
            window.removeEventListener("profilePic", handleProfilePicChange);
        };
    }, [user])

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(localStorage.getItem("user"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const handleGameChange = () => {
            setGameTitle(localStorage.getItem("currentGame"));
        }

        window.addEventListener("game", handleGameChange);

        return () => {
            window.removeEventListener("game", handleGameChange);
        }
    }, [])

    const logoutHandler = async (event) => {
        event.preventDefault();

        await customAxios.post(LOGOUT_EXTENSTION)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log("ERROR", error);
        });
        
        navigate(`${process.env.REACT_APP_HOME}`);
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.nav}>
                    <li className={styles.home}>
                        <Link to={process.env.REACT_APP_HOME} >Vale Games</Link>
                    </li>

                    <li>
                        <h1>
                            {gameTitle}
                        </h1>
                    </li>

                    <ul className={styles.topRight}>
                        { user ? (
                            <>
                                <li>
                                    <Link to={process.env.REACT_APP_ACCOUNT} id={styles.profileLink}>
                                        <img src={profilePic} className={styles.profilePic} alt="User Avatar"></img>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={logoutHandler}> Logout </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button onClick={toggleLoginOverlay}> Login </button>
                            </li>
                        )}
                    </ul>
                </ul>
            </nav>
        </header>
    )
};

export default Header;