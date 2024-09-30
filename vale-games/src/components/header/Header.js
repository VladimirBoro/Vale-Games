import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css"
import { fetchProfilePic } from "../../util/restful";

const Header = () => {
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));
    const [gameTitle, setGameTitle] = useState(localStorage.getItem("currentGame"));

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
    }, [])

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

    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.nav}>
                    <li className={styles.home}>
                        <Link to="/" >Vale Games</Link>
                    </li>

                    <li>
                        <h1 style={{margin: 0}}>
                            {gameTitle}
                        </h1>
                    </li>

                    <ul className={styles.topRight}>
                        { user ? (
                            <>
                                <li>
                                    <Link to="/account" id={styles.profileLink}>
                                        <img src={profilePic} className={styles.profilePic}></img>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/logout">Logout {user}</Link>
                                </li>
                            </>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </ul>
            </nav>
        </header>
    )
};

export default Header;