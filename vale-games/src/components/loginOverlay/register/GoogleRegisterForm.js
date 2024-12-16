import React, { useState } from "react";
import loginStyle from "../styles.module.css";
import styles from "./register.module.css";
import customAxios from "../../../util/customAxios";
import { OVERLAY_STATE } from "../constants";

const GoogleRegisterForm = ({ switchType, credential }) => {
    const REGISTER_PATH = process.env.REACT_APP_REGISTER_VALEGAMES_PATH;

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
            switchType(OVERLAY_STATE.LOGIN);
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

    return (
        <div className={loginStyle.form}>
            <h2>Register your username!</h2>
            { usernameError ? (
                <p style={{color: "red"}}>Username already in use</p>
            ) : (
                <></>
            )}

            <form className={loginStyle.form} onSubmit={registerUser}>
                <label htmlFor="username">Username*</label>
                <input 
                    type="text" 
                    name="username"
                    value={username}
                    onInput={handleChange} 
                    required
                />
                <div className={loginStyle.form}>
                    <p>Profile Picture</p>
                    <img src={preview} alt="User Avatar" className={styles.preview}/>
                    <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg"/>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
};

export default GoogleRegisterForm;