import React, { useEffect, useState } from "react";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import customAxios from "../../util/customAxios";
import styles from "./account.module.css";
import { updateProfile } from "../../util/restful";

function Account() {
    const URL = process.env.REACT_APP_SERVER_URL;
    const PATH = process.env.REACT_APP_PLAYER_SCORES;

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("user"));
    const [image, setImage] = useState(null);

    const fetchHighScores = async() => {
        await customAxios.get(URL,
            {
                withCredentials: true
            }
        )
        .then(response => {
            console.log(response);
        })
    }

    // fetch scores
    useEffect(() => {
        fetchHighScores();
    }, [])

    const editProfile = () => {
        setEditing(!editing);
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    }

    const handleUsernameChange = (e) => {
        console.log(e.target.value);
        setUsername(e.target.value);
    }

    const handleUpdate = async () => {
        await updateProfile(image, username);

        setEditing(!editing);
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
                    <div className={styles.profilePic}>
                        <img alt="User profile picture."/>
                        <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg"/>
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input  name="username" onChange={handleUsernameChange} defaultValue={localStorage.getItem("user")}/>
                        <p>Account created: whenever</p>
                        <button onClick={handleUpdate}>submit</button>
                        <button onClick={editProfile}>cancel</button>
                    </div>
                    {/* <input type="file" accept="image/png, image/jpeg"/> */}
                </div>
            ) : (
                <div className={styles.form}>
                    <div>
                        <img alt="User profile picture."/>
                    </div>
                    <div>
                        <p>Username: {localStorage.getItem("user")}</p>
                        <p>Account created: whenever</p>
                        <button onClick={editProfile}>edit profile</button>
                    </div>
                </div>   
            )}

            {/* highscores */}
            <div> 
                {/* <Leaderboard data={} printRow={printRow} metric={"Score"}></Leaderboard> */}
            </div>
        </div>
    );
}

export default Account;