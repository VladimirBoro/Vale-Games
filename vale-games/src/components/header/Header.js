import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css"

const Header = () => {
    const [user, setUser] = useState(localStorage.getItem("user"));

    useEffect(() => {
        const handleStorageChange = () => {
            console.log("user change!!!");
            setUser(localStorage.getItem("user"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    });

    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.nav}>
                    <li><Link to="/" className={styles.home}>Vale Games</Link></li>

                    <ul className={styles.topRight}>
                        { user ? (
                            <>
                                <li><Link to="/account">Account</Link></li>
                                <li><Link to="/logout">Logout {user}</Link></li>
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