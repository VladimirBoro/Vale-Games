import customAxios from "./customAxios";

export const getLeaderboard = async (path) => {
    let data = [];

    await customAxios.get(path)
        .then(response => {
            data = response.data;
        })
        .catch(error => console.log("LEADERBOARD ERROR", error));

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

export const fetchProfilePic = (username) => {
    return new Promise((resolve, reject) => {
        customAxios.get("/account/profilePicture", {
            params: {username: username},
            responseType: "blob"
        })
        .then(response => {
            const profilePic = new FileReader();
    
            profilePic.onloadend = () => {
                const base64profilePic = profilePic.result;
                resolve(base64profilePic);
            }
            profilePic.readAsDataURL(response.data);
        })
        .catch(err => reject("weird!", err));
    })
}

export const fetchMemberSince = (username) => {
    return new Promise((resolve, reject) => {
        customAxios.get("/account/created-at", {
            params: {username: username}
        })
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    })
}