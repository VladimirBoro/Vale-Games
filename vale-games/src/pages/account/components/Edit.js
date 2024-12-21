import React, { useState } from "react";
import  TakenUsername  from "./TakenUsername";
import { ACCOUNT_PAGE_STATE } from "../constants";
import customAxios from "../../../util/customAxios";
import styles from "../account.module.css";


function Edit({changeState, profilePic, memberSince}) {
    const [takenUsername, setTakenUsername] = useState(false);
    const [image, setImage] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(profilePic);
    const [username, setUsername] = useState(localStorage.getItem("user"));

    // callback!
    const setState = (state) => {
        changeState(state);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleFileChange = async (e) => {
        if (e.target.files.length !== 0) {
            setImage(e.target.files[0]);
        }
        else {
            setImage(null);
            return;
        }

        const profilePic = new FileReader();

        profilePic.onloadend = () => {
            const base64profilePic = profilePic.result;
            setProfilePicPreview(base64profilePic);
        }

        profilePic.readAsDataURL(e.target.files[0]);
    }

    const handleUpdate = async () => {
        const currentUsername = localStorage.getItem("user");
        if (currentUsername === username && image === null) {
            return;
        }

        const formData = new FormData();
        formData.append("oldUsername", localStorage.getItem("user"));
        formData.append("newUsername", username);
        formData.append("image", image);

        // update account
        console.log("posting update now!");
        try {
            await customAxios.post("/account/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (username !== "") {
                localStorage.setItem("user", username);
            }
        }
        catch (err) {
            console.log("error", err);
            setTakenUsername(true);
            return;
        }
        
        // set the pic
        setImage(profilePicPreview);
        
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("profilePic"));

        setState(ACCOUNT_PAGE_STATE.DEFAULT);
        setTakenUsername(false);
    }

    return (
        <div className={styles.form}>
            <img src={profilePicPreview} className={styles.profilePic} alt="User Avatar"/>
            <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg"/>    
            
            <div>
                <TakenUsername taken={takenUsername}/>
                <label htmlFor="username">Username:</label>
                <input  name="username" onChange={handleUsernameChange} defaultValue={localStorage.getItem("user")}  id={styles.username}/>
                <p>Account created: {memberSince}</p>
                <button onClick={handleUpdate} className={styles.button}>submit</button>
                <button onClick={() => setState(ACCOUNT_PAGE_STATE.DEFAULT)} className={styles.button}>cancel</button>
            </div>
        </div>
    )
}

export default Edit;