import React from "react";

function TakenUsername({taken}) {
    if (taken === false) {
        return (<></>);
    }
    else {
        return(<p style={{color:"red"}}>Username already in use</p>);
    }
    
}

export default TakenUsername;