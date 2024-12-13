import React from "react";
import { ACCOUNT_PAGE_STATE } from "../constants";
import { useNavigate } from "react-router-dom";
import customAxios from "../../../util/customAxios";
import styles from "../account.module.css";


function Delete({changeState}) {
    const navigate = useNavigate(); 

    const setState = () => {
        changeState(ACCOUNT_PAGE_STATE.DEFAULT);
    }

    const deleteProfile = async () => {
        await customAxios.post("/account/delete", null, {
            params: {username: localStorage.getItem("user")}
        })
        .then(response => console.log(response.data))
        .catch(err => console.log(err));

        navigate(`${process.env.REACT_APP_HOME}`);
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
    }

    return (
        <div className={styles.deleteForm}>
            <p>Are you sure you want to delete your account?</p>
            <div className={styles.deleteOptions}>
                <button className={styles.button} onClick={deleteProfile}> Yes </button>
                <button className={styles.button} onClick={setState}> No </button>
            </div>
        </div>
    )
}

export default Delete;