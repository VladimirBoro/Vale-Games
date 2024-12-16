import React, { useEffect, useState } from "react";
import styles from "./account.module.css";
import { fetchMemberSince, fetchProfilePic } from "../../util/restful";
import { ACCOUNT_PAGE_STATE } from "./constants";
import Default from "./components/Default";
import Edit from "./components/Edit";
import Delete from "./components/Delete";

function Account() {
    const [pageState, setPageState] = useState(ACCOUNT_PAGE_STATE.DEFAULT);
    const [profilePic, setProfilePic] = useState(null);
    const [memberSince, setMemberSince] = useState("");

    useEffect(() => {
        const fetchPreview = async () => {
            setProfilePic(await fetchProfilePic(localStorage.getItem("user")));
            setMemberSince(await fetchMemberSince(localStorage.getItem("user")));
        }

        // clear game title in header upon opening page
        localStorage.setItem("currentGame", "");
        window.dispatchEvent(new Event("game"));
        
        fetchPreview();
    }, [])


    // callback that will be passed down to state components
    const changeState = async (mode) => {
        if (mode === ACCOUNT_PAGE_STATE.DEFAULT) {
            setProfilePic(await fetchProfilePic(localStorage.getItem("user")));
        }

        setPageState(mode);
    }

    const renderForm = () => {
        switch (pageState) {
            case ACCOUNT_PAGE_STATE.DEFAULT:
                return <Default changeState={changeState} profilePic={profilePic} memberSince={memberSince} />
            case ACCOUNT_PAGE_STATE.EDIT:
                return <Edit changeState={changeState} profilePic={profilePic} memberSince={memberSince}/>
            case ACCOUNT_PAGE_STATE.DELETE:
                return <Delete changeState={changeState}/>
            default:
                console.error("error with page state!", pageState);
        }
    }

    return (
        <div className={styles.page}>
            {renderForm()}
        </div>
    );
}

export default Account;