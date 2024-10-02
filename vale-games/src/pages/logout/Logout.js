import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./logout.module.css"


const Logout = () => {
    // const URL = "http://localhost:8080";
    const URL = process.env.REACT_APP_SERVER_URL;
    const LOGOUT_EXTENSTION = process.env.REACT_APP_LOGOUT_PATH;

    const navigate = useNavigate(); 

    const logoutHandler = async (event) => {
        event.preventDefault();

        console.log("wtf");
        
        await axios.post(URL + LOGOUT_EXTENSTION, null, { withCredentials: true })
        .then(response => {
            console.log("success!", response);
        })
        .catch(error => {
            console.log("ERROR", error);
        });
        
        navigate("/");
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className={styles.page}>
            <div className={styles.form}>
                <p>
                    Are you sure you want to log out?
                </p>
                <form>
                    <button onClick={logoutHandler}>Yes</button>
                    <Link to="/" className={styles.noBtn}>
                        <button>No</button>
                    </Link>
                </form>
            </div>
        </div>
    )
};

export default Logout;