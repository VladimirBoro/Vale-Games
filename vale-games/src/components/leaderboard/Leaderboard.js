import React, { useEffect, useState, useRef } from "react";
import { getLeaderboard, fetchProfilePic } from "../../util/restful";
import { isMobile } from "react-device-detect";
import styles from "./leaderboard.module.css"

function Leaderboard({ metric, gameName, refetchFlag }) {
    const [data, setData] = useState([]);
    const [showWholeLeaderboard, setShowWholeLeaderboard] = useState(false);
    const [profilePics, setProfilePics] = useState([]);

    const showMore = useRef(false);
    const showMoreMessage = useRef("Show More");

    useEffect(() => {
        console.log("flag", refetchFlag);

        const fetchLeaderboard = async () => {
            if (showWholeLeaderboard) {
                console.log("SHOW ALL");
                setData(await getLeaderboard(`/${gameName}/leaderboard`));
            }
            else {
                console.log("fetching fetching...");
                setData(await getLeaderboard(`/${gameName}/leaderboard-top10`));
            }

        }
        
        fetchLeaderboard();
    }, [showWholeLeaderboard, refetchFlag, gameName])

    useEffect(() => {
        const fetchProfilePics = async () => {
            let pics = [];
            for (let i = 0; i < data.length; i++) {
                pics[i] = await fetchProfilePic(data[i].username);
            }

            setProfilePics(pics);
        }
        
        fetchProfilePics();
    }, [data])

    let emptyMsg = "";
    if (!data || data.length === 0) {
        emptyMsg = "No one on the Leaderboard yet!";
    }
    
    const show = () => {
        showMore.current = !showMore.current;
        if (showMore.current) {
            showMoreMessage.current = "Hide";
        }
        else {
            showMoreMessage.current = "Show More";
        }
        setShowWholeLeaderboard(!showWholeLeaderboard);
    }

    return (
        <div className={styles.tableContainer}>
            <div>
                <h2 style={{textAlign: "center"}}>Leaderboard:</h2>
                <p>{emptyMsg}</p>
                <table>
                    <thead>
                        <tr>
                            <th className={`${isMobile ? styles.mobileSpacing : ""}`}>Rank</th>
                            <th className={`${isMobile ? styles.mobileSpacing : ""}`} scope="col">
                                Player
                            </th>
                            <th className={`${isMobile ? styles.mobileSpacing : ""}`} scope="col">Date</th>
                            <th className={`${isMobile ? styles.mobileSpacing : ""}`} scope="col">{metric}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function(entry, index) {
                            return (
                                <tr key={index}>
                                    <td className={`${isMobile ? styles.mobileSpacing : ""}`} style={{textAlign: "center"}}>
                                        {index + 1}
                                    </td>
                                    <td className={`${isMobile ? styles.mobileSpacing : ""}`}>
                                        <div className={styles.cell}>
                                            <img src={profilePics[index] == null ? null : profilePics[index]} alt="Profile Pic"/>
                                            <span>
                                                {entry.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`${isMobile ? styles.mobileSpacing : ""}`}>{entry.date}</td>
                                    <td className={`${isMobile ? styles.mobileSpacing : ""}`} style={{textAlign: "center"}}>{entry.score == null ? entry.time : entry.score}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            <button onClick={show} id={styles.showAll}>{showMoreMessage.current}</button>
            </div>
        </div>
    );
}

export default Leaderboard;