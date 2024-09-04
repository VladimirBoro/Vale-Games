import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import login from "./login.module.css"


const Login = () => {
    const navigate = useNavigate();

    const [usernameError, setUsernameError] = React.useState(false);

    const usernameRef = React.useRef();
    const passwordRef = React.useRef();

    // const URL = "http://localhost:8080";
    const URL = process.env.REACT_APP_SERVER_URL;
    const GOOGLE_LOGIN_PATH = process.env.REACT_APP_LOGIN_GOOGLE_PATH;
    const LOGIN_PATH = process.env.REACT_APP_LOGIN_VALEGAMES_PATH;

    const handleLoginSuccess = async (response) => {
        const credential = response.credential;

        console.log(credential);

        let postResponse; // will contain username on successful response

        await axios.post(URL + LOGIN_PATH,
            {
                password: credential,
                type: "google"
            },
            {
                withCredentials: true
            }
        )
        .then(res => {
            postResponse = res.data;
            console.log("Success in backend.", postResponse);
        })
        .catch(error => {
            console.log("error!!", error);
        })

        if (postResponse === "register") {
            console.log("register time");
            navigate("/registerGoogler", { state: { credential: credential } });
        }
        else {
            localStorage.setItem("user", postResponse);
            window.dispatchEvent(new Event("storage")); // trigger event
            navigate("/");
            console.log("logged in!");
        }
    };

    const handleLoginFailure = (error) => {
        console.log("Googler error:", error);
    };

    // TEMPORARY MANUAL LOGIN
    const submitLogin = async (event) => {
        event.preventDefault();

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        console.log("logging in!");

        await axios.post(URL + LOGIN_PATH, 
            {
                username: username,
                password: password,
                type: "valegames"
            },
            { 
                withCredentials: true 
            }
        )
        .then(response => {
            setUsernameError(false);
            localStorage.setItem("user", response.data);
            window.dispatchEvent(new Event("storage")); // trigger event
            navigate("/");
            console.log(response.data);
        })
        .catch(error => {
            setUsernameError(true);
            console.log(error)
        });

        console.log("logging in!", username, password);
    }

    return (
        <div className={login.page}>
            <div className={login.signIn}>
                <h2>Login</h2>
                <section>
                    <section className={login.googleButton}>
                        <GoogleLogin
                            buttonText="Login with Googler"
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </section>

                    <p>------ or -------</p>

                    <section className={login.formContainer}>
                        {usernameError ? (
                            <p>USERNAME OR PASSWORD INCORRECT0</p>
                        ) : (
                            <></>
                        )}
                        <form onSubmit={submitLogin} className={login.form}>
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" ref={usernameRef} required/>

                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" ref={passwordRef} required/>

                            <button type="submit">Login</button>
                        </form>
                    </section>

                    <section className={login.signUp}>
                        <span>Not a member? </span>
                        <Link to="/register">Sign Up</Link>
                    </section>

                </section>
            </div>
        </div>
    )
};

export default Login;