import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import login from "../login/login.module.css"

const RegisterGoogler = () => {
    const URL = process.env.REACT_APP_SERVER_URL;
    const REG_URL = process.env.REACT_APP_REGISTER_GOOGLE_PATH;
    const REGISTER_PATH = process.env.REACT_APP_REGISTER_VALEGAMES_PATH;


    const location = useLocation();
    const navigate = useNavigate();
    const { credential } = location.state || {};

    const [username, setUsername] = useState(""); 
    const [usernameError, setUsernameError] = useState(false);

    function registerUser(event) {
        event.preventDefault();
        console.log(username, credential);
        
        axios.post(URL + REGISTER_PATH,
            {
                password: credential,
                username: username,
                type: "google"
            },
            {
                withCredentials: true
            }
        )
        .then(res => {
            console.log("Successful goog register:", res.data);
            setUsernameError(false);
            navigate("/login");
        })
        .catch(err => {
            console.log("ERROR:", err);
            setUsernameError(true);
        });
    }

    function handleChange(event) {
        setUsername(event.target.value);
    }

    return (
        <div className={login.page}>
            <div className={login.signIn}>
                <h1>Register your username!</h1>
                <div className={login.formContainer}>
                    { usernameError ? (
                        <p>USERNAME ALREADY IN USE</p>
                    ) : (
                        <></>
                    )}
                    <form className={login.form} onSubmit={registerUser}>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={username}
                            onInput={handleChange} 
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default RegisterGoogler;