import React, { useEffect } from "react";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import customAxios from "../../util/customAxios";

function Account() {
    const URL = process.env.REACT_APP_SERVER_URL;
    const PATH = process.env.REACT_APP_PLAYER_SCORES;

    const fetchHighScores = async() => {
        await customAxios.get(URL,
            {
                withCredentials: true
            }
        )
        .then(response => {
            console.log(response);
        })
    };

    // fetch scores
    useEffect(() => {
        fetchHighScores();
    }, []);

    const editProfile = () => {

    };

    const printRow = (entry) => {
        return (
            <>
                <th scope="row">{entry.username}</th>
                <td>{entry.date}</td>
                <td>{entry.score}</td>
            </>
        );
    };

    return (
        <div>
            {/* user info:
                username
                date created */}
            <section>
                <p>Username: {localStorage.getItem("user")}</p>
                <p>Account created: whenever</p>
                <button onClick={editProfile}>edit profile</button>
            </section>

            {/* highscores */}
            <section> 
                {/* <Leaderboard data={} printRow={printRow} metric={"Score"}></Leaderboard> */}
            </section>
        </div>
    );
}

export default Account;