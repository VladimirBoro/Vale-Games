import axios from "axios";

export const customAxios = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
    validateStatus: (status) => {
        return status < 400;
    }
});

customAxios.interceptors.response.use(
    response => response,
    error => {
        if (localStorage.getItem("user") != null && !error.response) {
            console.log("No server response");
            // localStorage.removeItem("user");
            localStorage.clear();
            window.location.reload();
        }
        else if (error.response.status === 403) {
            // localStorage.removeItem("user");
            localStorage.clear();
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
)

export default customAxios;