import React, {useEffect, useState, useRef} from "react";

function Timer ({initTime, startTimer, stopTimer, updateTime = null }) {
    const time = useRef(initTime);
    const intervalId = useRef(null);
    const [timeDisplay, setTimeDisplay] = useState("00:00");

    useEffect(() => {
        if (!startTimer && !stopTimer) {
            console.log("RESET THE TIME", stopTimer);
            setTimeDisplay("00:00");
        }

        if (startTimer) {
            start();
        }
        
        if (stopTimer) {
            stop();
        }
        
        return () => clearInterval(intervalId.current);
    }, [startTimer, stopTimer]);

    const start = () => {
        let currentTimeString = "00:00";
        time.current = 0;

        intervalId.current = setInterval(() => {
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
    
    const stop = () => {
        clearInterval(intervalId.current);
    }

    return (
        <>
            <span>🕒: {timeDisplay}</span>
        </>
    )
}

export default Timer;