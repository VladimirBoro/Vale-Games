import React, { useState, useRef } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { OVERLAY_STATE } from '../constants';
import login from "../styles.module.css";
import styles from "./register.module.css";
import ConfirmPassword from "./ConfirmPassword";
import customAxios from "../../../util/customAxios";
import placeholderPic from "../../../assets/images/default_1.png";

function VgRegisterForm({switchType, toggleOverlay, setGoogleId}) {
    const REGISTER_PATH = process.env.REACT_APP_REGISTER_VALEGAMES_PATH;

    const [usernameError, setUsernameError] = useState(false);
    const [matching, setMatching] = useState(true);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(placeholderPic);

    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const confirmRef = useRef("");

    const registerUser = (event) => {
        event.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const confirm = confirmRef.current.value;
        const type = "valegames";

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("image", image);
        formData.append("type", type);

        setMatching(true);
        if (password !== confirm) {
            setMatching(false);
            return;
        }

        customAxios.post(REGISTER_PATH, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        .then(response => {
            console.log(response);
            setUsernameError(false);
            switchType(OVERLAY_STATE.LOGIN);
        })
        .catch(error => {
            setUsernameError(true);
        });
    }

    const handleFileChange = (e) => {
        if (e.target.files.length !== 0) {
            setImage(e.target.files[0]);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Set the image preview URL
            };
            reader.readAsDataURL(e.target.files[0]); // Read the file as a data URL
        }
        else {
            setPreview(null);
        }
    }

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
                setGoogleId(credential);
            }
            else {
                localStorage.setItem("user", postResponse.data);
                
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new Event("profilePic"));

                toggleOverlay(); // close overlay
            }
        }
        catch (error) {
            console.log("ERROR",error.response.status)
        }  
    };
    
    const handleLoginFailure = (error) => {
        console.log("Googler error:", error);
    };

    const handleSignUp = () => {
        switchType(OVERLAY_STATE.LOGIN);
    }

    return (
        <form onSubmit={registerUser} className={login.form}>
            <h2>Register</h2>
            
            <div className={login.googleButton}>
                <GoogleLogin
                    buttonText="Login with Googler"
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>

            <p>------ or -------</p>

            {usernameError ? (
                <p style={{color: "red"}}>Username already in use</p>
            ) : (
                <></>
            )}

            <div className={login.form}>
                <label htmlFor="username">Username*</label>
                <input type="text" name="username" ref={usernameRef} required/>

                <ConfirmPassword matching={matching}/>

                <label htmlFor="password">Password*</label>
                <input type="password" ref={passwordRef} required/>

                <label htmlFor="password">Confirm Password*</label>
                <input type="password" ref={confirmRef} required/>
            </div>
            <div>
                <p>Profile Picture</p>
                <img src={preview} alt="profile picture placeholder" className={styles.preview}/>
                <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg"/>
            </div>

            <button type="submit">Register</button>

            <div className={login.signUp}>
                <span>Already Signed Up? </span>
                <button onClick={handleSignUp} style={{padding: "3px 6px", fontSize: "0.75em"}}>Log In</button>
            </div>
        </form>
    )
};

export default VgRegisterForm;