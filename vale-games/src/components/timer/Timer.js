import React, {useEffect, useState, useRef} from "react";

function Timer ({initTime, startTimer, updateTime = null }) {
    const time = useRef(initTime);
    const [timeDisplay, setTimeDisplay] = useState("00:00");

    useEffect(() => {
        let currentTimeString;
        let timeInterval;
        
        if (startTimer) {
            timeInterval = setInterval(() => {
                time.current += 1;
                
                setTimeDisplay(() => {
                    let currentMinutes = Math.floor(time.current / 60);
                    let currentSeconds = time.current % 60;
    
                    let minutesString = currentMinutes.toString();
                    let secondsString = currentSeconds.toString();
                    if (currentMinutes < 10) {
                        minutesString = "0" + minutesString;
                    }
    
                    if (currentSeconds < 10) {
                        secondsString = "0" + secondsString;
                    }
    
                    currentTimeString = minutesString + ":" + secondsString;
    
                    if (updateTime !== null) {
                        updateTime(currentTimeString);
                    }
    
                    return currentTimeString;
                });
            }, 1000);
        }
        else {
            time.current = 0;
            setTimeDisplay("00:00");
        }

        return () => clearInterval(timeInterval);
    }, [startTimer]);

    return (
        <>
            <span>🕒: {timeDisplay}</span>
        </>
    )
}

export default Timer;