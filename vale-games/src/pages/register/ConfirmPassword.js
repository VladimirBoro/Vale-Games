import React from "react";

function ConfirmPassword({matching}) {
    if (matching === true) {
        return (<></>);
    }
    else {
        return(<p style={{color:"red"}}>password's do not match</p>);
    }
    
}

export default ConfirmPassword;