import React from "react";
import axios from 'axios';
import login from "../login/login.module.css"


const Register = () => {
    const URL = process.env.REACT_APP_SERVER_URL;
    const REGISTER_PATH = process.env.REACT_APP_REGISTER_VALEGAMES_PATH;

    const [usernameError, setUsernameError] = React.useState(false);

    const usernameRef = React.useRef();
    const passwordRef = React.useRef();

    function registerUser(event) {
        event.preventDefault();

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        axios.post(URL + REGISTER_PATH,
            {
                username: username,
                password: password
            },
            {
                withCredentials: true
            }
        )
        .then(request => {
            setUsernameError(false);
            console.log("ramadan challenge!", request.data);
        })
        .catch(error => {
            setUsernameError(true);
            console.log("HAHAHA", error);
        });
    }

    return (
        <div>
            <h1>Register</h1>
            <section className={login.formContainer}>
                {usernameError ? (
                    <p>USERNAME IS IN USE ALREADY</p>
                ) : (
                    <></>
                )}
                <form onSubmit={registerUser} className={login.form}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" ref={usernameRef} required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" ref={passwordRef} required/>

                    <button type="submit">Register</button>
                </form>
            </section>
        </div>
    )
};

export default Register;