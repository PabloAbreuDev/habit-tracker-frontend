import axios from "axios";
import refreshToken from "./refresh";

const api = axios.create({ baseURL: "http://localhost:3001" })

// Adicionando  token aos interceptors
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("@Auth:token")

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Adicionando refresh token ao interceptor, caso o retorno seja 403 (forbidden) então retenta
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;

        console.log(error.response)

        if (error?.response?.status === 403 && !config?.sent) {
            config.sent = true;

            const result = await refreshToken();

            if (result?.accessToken) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${result?.accessToken}`,
                };
            }

            return api(config);
        }
        return Promise.reject(error);
    }
);




export default api