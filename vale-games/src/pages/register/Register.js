import React, { useState, useRef } from "react";
import axios from 'axios';
import login from "../login/login.module.css";
import styles from "./register.module.css";
import ConfirmPassword from "./ConfirmPassword";
import customAxios from "../../util/customAxios";
import { useNavigate } from "react-router-dom";



function Register() {
    const URL = process.env.REACT_APP_SERVER_URL;
    const REGISTER_PATH = process.env.REACT_APP_REGISTER_VALEGAMES_PATH;
    const navigate = useNavigate();

    const [usernameError, setUsernameError] = useState(false);
    const [matching, setMatching] = useState(true);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);


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
            setUsernameError(false);
            navigate("/login");
            console.log("ramadan challenge!", response.data);
        })
        .catch(error => {
            console.log("HAHAHA", error);
            setUsernameError(true);
        });
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setImage(e.target.files[0]);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Set the image preview URL
            };
            reader.readAsDataURL(e.target.files[0]); // Read the file as a data URL
        }
    }

    return (
        <div className={login.page}>
            <div className={login.signIn}>
                <h1>Register</h1>
                <div className={login.formContainer}>
                    {usernameError ? (
                        <p>USERNAME IS IN USE ALREADY</p>
                    ) : (
                        <></>
                    )}
                    <form onSubmit={registerUser} className={login.form}>
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
                            <img src={preview} alt="dope profile pic" className={styles.preview}/>
                            <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg"/>
                        </div>

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Register;