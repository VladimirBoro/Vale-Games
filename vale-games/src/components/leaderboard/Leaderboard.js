import React from "react";
import "./leaderboard.css"

function Leaderboard({ data, printRow, metric }) {
    console.log("data!", data);

    return (
        <div>
            <section>
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
            </section>
        </div>
    );
}

export default Leaderboard;