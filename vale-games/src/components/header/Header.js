import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import header from "./header.module.css"

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
        <header>
            <nav>
                <ul className={header.nav}>
                    <li><Link to="/" className={header.home}>Vale Games</Link></li>

                    <ul className={header.nav}>
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