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

export const fetchProfilePic = (username) => {
    customAxios.get("/account/profilePicture", {
        params: {username: username},
        responseType: "blob"
    })
    .then(response => {
        const profilePic = new FileReader();

        profilePic.onloadend = () => {
            const base64profilePic = profilePic.result;
            localStorage.setItem("profilePic",  base64profilePic);
            window.dispatchEvent(new Event("storage"));

        }
        profilePic.readAsDataURL(response.data);
        // console.log("setting profile pic NOW.", response.data);
    })
    .catch(err => console.log("weird!", err));
}