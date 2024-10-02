import React, { useEffect, useState, useRef } from "react";
import VgRegisterForm from "./register/VgRegisterForm";
import LoginForm from "./login/LoginForm";
import GoogleRegisterForm from "./register/GoogleRegisterForm";
import styles from "./styles.module.css";
import { OVERLAY_STATE } from "./constants";

function LoginOverlay({showOverlay, typeToDisplay, switchType, toggleOverlay}) {
    const [displayOverlay, setDisplayOverlay] = useState(showOverlay);
    const [googleCredential, setGoogleCredential] = useState(null);
    
    useEffect(() => {
        console.log(displayOverlay, "yyeeep", typeToDisplay);
        setDisplayOverlay(showOverlay);

    }, [showOverlay])

    const googleRegister = (cred) => {
        setGoogleCredential(cred);
        switchType(OVERLAY_STATE.GOOGLE_REGISTER);
    }

    const renderForm = () => {
        console.log(typeToDisplay, "TYPE", googleCredential);
        switch (typeToDisplay) {
            case OVERLAY_STATE.LOGIN:
                return <LoginForm switchType={switchType} toggleOverlay={toggleOverlay} setGoogleId={googleRegister}/>;
            case OVERLAY_STATE.VG_REGISTER:
                return <VgRegisterForm switchType={switchType} toggleOverlay={toggleOverlay} setGoogleId={googleRegister}/>;
            case OVERLAY_STATE.GOOGLE_REGISTER:
                return <GoogleRegisterForm switchType={switchType} credential={googleCredential}/>;
            default:
                return null;
        }
    }

    return (<>
        <div className={styles.page} style={{display: `${displayOverlay ? "flex" : "none"}`}}>
            <div className={styles.signIn}>
                <div className={styles.xContainer}>
                    <button className={styles.x} onClick={toggleOverlay}> &#10005; </button>
                </div>

                {renderForm()}
                
            </div>
        </div>
    </>)
}

export default LoginOverlay;