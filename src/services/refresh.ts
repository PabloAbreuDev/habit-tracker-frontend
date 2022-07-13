import api from "./api";

const refreshToken = async () => {
    const refresh_token = localStorage.getItem("@Auth:refresh_token");
    try {
        const { data } = await api.post("/users/refresh", {
            refresh_token
        })
        if (!data?.access_token) {
            localStorage.removeItem("@Auth:token");
            localStorage.removeItem("@Auth:refresh_token");
        }

        localStorage.setItem("@Auth:token", data.access_token);
        return data.access_token
    } catch (err) {
        localStorage.removeItem("@Auth:token");
        localStorage.removeItem("@Auth:refresh_token");
    }
}

export default refreshToken