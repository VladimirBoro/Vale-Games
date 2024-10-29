import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { OVERLAY_STATE } from "../constants";
import styles from "../styles.module.css"
import customAxios from "../../../util/customAxios";


const LoginForm = ({switchType, toggleOverlay, setGoogleId}) => {
    const [usernameError, setUsernameError] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const LOGIN_PATH = process.env.REACT_APP_LOGIN_VALEGAMES_PATH;

    const handleLoginSuccess = async (response) => {
        const credential = response.credential;

        try {
            const postResponse = await customAxios.post("/login/valegames",
                {
                    password: credential,
                    type: "google"
                }
            );

            if (postResponse.status === 201) {
                console.log("register time");
                setGoogleId(credential);
            }
            else {
                localStorage.setItem("user", postResponse.data);
                
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new Event("profilePic"));

                toggleOverlay();
            }
        }
        catch (error) {
            console.log("ERROR",error.response.status)
        }     
    };
    
    const handleLoginFailure = (error) => {
        console.log("Googler error:", error);
    };
    
    const submitLogin = async (event) => {
        event.preventDefault();
        
        await customAxios.post(LOGIN_PATH, 
            {
                username: username,
                password: password,
                type: "valegames"
            }
        )
        .then(response => {
            setUsernameError(false);
            setUsername("");
            setPassword("");
            localStorage.setItem("user", response.data);
            
            toggleOverlay();
        })
        .catch(error => {
            setUsernameError(true);
            console.log(error)
        });

        
        if (localStorage.getItem("user") != null) {
            window.dispatchEvent(new Event("profilePic"));
            window.dispatchEvent(new Event("storage"));
        }
    }

    const handleSignUp = () => {
        switchType(OVERLAY_STATE.VG_REGISTER);
    }

    return (
        <div>
            <h2>Log In</h2>

            <div className={styles.googleButton}>
                <GoogleLogin
                    buttonText="Log In with Googler"
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>

            <p>------ or -------</p>

            <div className={styles.form}>
                {usernameError ? (
                    <p style={{color: "red"}}>Incorrect Username or Password</p>
                ) : (
                    <></>
                )}
                <form onSubmit={submitLogin} className={styles.form}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

                    <button type="submit">Log In</button>
                </form>
            </div>

            <div className={styles.signUp}>
                <span>Not a member? </span>
                <button onClick={handleSignUp} style={{padding: "3px 6px", fontSize: "0.75em"}}>Sign Up</button>
            </div>
        </div>
    )
};

export default LoginForm;