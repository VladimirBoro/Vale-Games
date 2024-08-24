import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RegisterGoogler = () => {
    const URL = process.env.REACT_APP_SERVER_URL;
    const REG_URL = process.env.REACT_APP_REGISTER_GOOGLE_PATH;

    const location = useLocation();
    const navigate = useNavigate();
    const { credential } = location.state || {};

    const [username, setUsername] = useState(""); 
    const [usernameError, setUsernameError] = useState(false);

    function registerUser(event) {
        event.preventDefault();
        console.log(username, credential);
        
        axios.post(URL + REG_URL,
            {
                credential: credential,
                username: username
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
        <div>
            <h1>Register your Vale Games username!</h1>
            <section>
                { usernameError ? (
                    <p>USERNAME ALREADY IN USE</p>
                ) : (
                    <></>
                )}
                <form onSubmit={registerUser}>
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
            </section>
        </div>
    )
};

export default RegisterGoogler;