import React from "react";
import styles from "./leaderboard.module.css"

function Leaderboard({ data, printRow, metric }) {
    let emptyMsg = "";
    if (data && data.length === 0) {
        emptyMsg = "No one on the Leaderboard yet!";
    }

    return (
        <div className={styles.tableContainer}>
            <div>
                <p>{emptyMsg}</p>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Player</th>
                            <th scope="col">Date</th>
                            <th scope="col">{metric}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function(entry, index) {
                            return (
                                <tr key={index}>
                                    {printRow(entry)}
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