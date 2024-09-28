import React from "react";
import styles from "./leaderboard.module.css"

function Leaderboard({ data, printRow, metric, profilePics }) {
    let emptyMsg = "";
    if (data && data.length === 0) {
        emptyMsg = "No one on the Leaderboard yet!";
        return;
    }

    // data.map((entry) => {
    //     entry = [...data, pp: ...profilePics]
    // });

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
                                        <img src="" alt="Here is the pic bruh"/>
                                        {entry.username}
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