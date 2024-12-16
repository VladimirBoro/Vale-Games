import React from "react";
import { ACCOUNT_PAGE_STATE } from "../constants";
import styles from "../account.module.css";

function Default({changeState, profilePic, memberSince}) {
    const setState = (state) => {
        changeState(state);
    }

    return (
        <div className={styles.form}>
            <div>
                <img src={profilePic} className={styles.profilePic} alt="User Avatar"/>
            </div>
            <div>
                <p>Username: {localStorage.getItem("user")}</p>
                <p>Account created: {memberSince}</p>
            </div>

            <div> 
                <button onClick={() => setState(ACCOUNT_PAGE_STATE.EDIT)} className={styles.button}>edit profile</button>
                <button onClick={() => setState(ACCOUNT_PAGE_STATE.DELETE)} className={styles.button}>delete profile</button>
            </div>
        </div>   
    )
}

export default Default;