import customAxios from "./customAxios";

export const getLeaderboard = async (path) => {
    let data = [];

    await customAxios.get(path)
        .then(response => {
            console.log("response", response.data);
            data = response.data;
        })
        .catch(error => console.log(error));

    return data;
}

export const sendLeaderboardData = async (path, username, value, metric) => {
    let responseMsg;
    await customAxios.post(path, null,
        {
            params: {
                username: username,
                [metric]: value
            }
        }
    )
    .then(response => {
        responseMsg = response.data;   
    })
    .catch(error => console.error(error));

    return responseMsg;
}