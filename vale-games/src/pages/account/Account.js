import React, { useEffect, useState } from "react";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import customAxios from "../../util/customAxios";
import styles from "./account.module.css";
import { updateProfile } from "../../util/restful";
import { useNavigate } from "react-router-dom";
import { fetchProfilePic } from "../../util/restful";
import  TakenUsername  from "./components/TakenUsername";

function Account() {
    const navigate = useNavigate(); 

    const URL = process.env.REACT_APP_SERVER_URL;
    const PATH = process.env.REACT_APP_PLAYER_SCORES;

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("user"));
    const [image, setImage] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [takenUsername, setTakenUsername] = useState(false);

    // fetch scores
    useEffect(() => {
        setTakenUsername(false);
        setProfilePicPreview(localStorage.getItem("profilePic"));
    }, [])

    const editProfile = () => {
        setProfilePicPreview(localStorage.getItem("profilePic"));
        setEditing(!editing);
    }

    const deleteProfile = async () => {
        console.log("deleting user...", username);

        await customAxios.post("/account/delete", null, {
            params: {username: username}
        })
        .then(response => console.log(response.data))
        .catch(err => console.log(err));

        navigate("/");
        // localStorage.removeItem("user");
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }

        const profilePic = new FileReader();

        profilePic.onloadend = () => {
            const base64profilePic = profilePic.result;
            setProfilePicPreview(base64profilePic);
        }

        profilePic.readAsDataURL(e.target.files[0]);
    }

    const handleUsernameChange = (e) => {
        console.log(e.target.value);
        setUsername(e.target.value);
    }

    const handleUpdate = async () => {
        // await updateProfile(image, username);
        const currentUsername = localStorage.getItem("user");
        if (currentUsername === username && image === null) {
            console.log("u gotta update to update mang");
            return;
        }

        console.log(localStorage.getItem("user"));
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
        console.log("fetching after the update");
        setImage(profilePicPreview);
        localStorage.setItem("profilePic", profilePicPreview);
        
        window.dispatchEvent(new Event("storage"));
        setEditing(!editing);
        setTakenUsername(false);
    }

    const printRow = (entry) => {
        return (
            <>
                <th scope="row">{entry.username}</th>
                <td>{entry.date}</td>
                <td>{entry.score}</td>
            </>
        );
    };

    return (
        <div className={styles.page}>
            {editing ? (
                <div className={styles.form}>
                    <img src={profilePicPreview} className={styles.profilePic} alt="User profile picture."/>
                    <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg"/>    
                    
                    <div>
                        <TakenUsername taken={takenUsername}/>
                        <label htmlFor="username">Username:</label>
                        <input  name="username" onChange={handleUsernameChange} defaultValue={localStorage.getItem("user")}  id={styles.username}/>
                        <p>Account created: whenever</p>
                        <button onClick={handleUpdate} className={styles.button}>submit</button>
                        <button onClick={editProfile} className={styles.button}>cancel</button>
                    </div>
                </div>
            ) : (
                <div className={styles.form}>
                    <div>
                        <img src={localStorage.getItem("profilePic")} className={styles.profilePic} alt="User profile picture."/>
                    </div>
                    <div>
                        <p>Username: {localStorage.getItem("user")}</p>
                        <p>Account created: whenever</p>
                    </div>

                    <div> 
                        <button onClick={editProfile} className={styles.button}>edit profile</button>
                        <button onClick={deleteProfile} className={styles.button}>delete profile</button>
                    </div>

                </div>   
            )}
        </div>
    );
}

export default Account;