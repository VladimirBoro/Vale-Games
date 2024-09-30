import React, { useEffect, useState } from "react";
import styles from "./leaderboard.module.css"
import { fetchProfilePic } from "../../util/restful";

function Leaderboard({ data, metric }) {
    const [profilePics, setProfilePics] = useState([]);

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
    if (data && data.length === 0) {
        emptyMsg = "No one on the Leaderboard yet!";
        return;
    }


    return (
        <div className={styles.tableContainer}>
            <div>
                <h2 style={{textAlign: "center"}}>Leaderboard:</h2>
                <p>{emptyMsg}</p>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">
                                Player
                            </th>
                            <th scope="col">Date</th>
                            <th scope="col">{metric}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function(entry, index) {
                            return (
                                <tr key={index}>
                                    <td scope="row">
                                        <div className={styles.cell}>
                                            <img src={profilePics[index] == null ? null : profilePics[index]} alt={profilePics[index] == null}/>
                                            <span>
                                                {entry.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{entry.date}</td>
                                    <td>{entry.score == null ? entry.time : entry.score}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;