import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "../login/login.module.css"
import customAxios from "../../util/customAxios";

const RegisterGoogler = () => {
    const REGISTER_PATH = process.env.REACT_APP_REGISTER_VALEGAMES_PATH;

    const location = useLocation();
    const navigate = useNavigate();
    const { credential } = location.state || {};

    const [username, setUsername] = useState(""); 
    const [usernameError, setUsernameError] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    function registerUser(event) {
        event.preventDefault();
        console.log(username, credential);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", credential);
        formData.append("image", image);
        formData.append("type", "google");
        
        customAxios.post(REGISTER_PATH, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
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
        <div className={styles.page}>
            <div className={styles.signIn}>
                <h1>Register your username!</h1>
                <div className={styles.formContainer}>
                    { usernameError ? (
                        <p>USERNAME ALREADY IN USE</p>
                    ) : (
                        <></>
                    )}
                    <form className={styles.form} onSubmit={registerUser}>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={username}
                            onInput={handleChange} 
                            required
                        />
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

export default RegisterGoogler;