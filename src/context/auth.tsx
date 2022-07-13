import React, { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IUser } from "../interfaces/user";

import api from "../services/api";

export interface DefaultAuthValue {
    doLogin: (email: string, password: string) => void,
    doLogout: () => void,
    logged: boolean,
    user: IUser | null,
    loginError: string
}

export const AuthContext = createContext<DefaultAuthValue | null>(null);

const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loginError, setLoginError] = useState<string>("")

    useEffect(() => {
        const loadingStorageData = async () => {


            const storageAcessToken = localStorage.getItem("@Auth:token");
            // const storageRefreshToken = localStorage.getItem("@Auth:refresh_token");
            // const storageUser = localStorage.getItem("@Auth:user");


            console.log(storageAcessToken)

            // Se há acess token, então busca os dados na /me
            if (storageAcessToken) {


                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${storageAcessToken}`;

                const { data } = await api.get<IUser>("/users/me")

                setUser(data)
            }
        }

        loadingStorageData()
    }, [])

    const doLogin = async (email: string, password: string) => {
        try {
            const { data } = await api.post<
                {
                    access_token: string,
                    refresh_token: string,
                    user: IUser
                }

            >("/users/login", {
                email,
                password,
            });

            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.access_token}`;

            setUser(data.user)
            localStorage.setItem("@Auth:token", data.access_token);
            localStorage.setItem("@Auth:refresh_token", data.refresh_token);
            localStorage.setItem("@Auth:user", JSON.stringify(data.user));
        } catch (err: any) {
            setLoginError(err.response.data.message)
        }
    };

    const doLogout = () => {
        localStorage.clear();
        setUser(null);
        return <Navigate to="/" />;
    };

    return <AuthContext.Provider value={{
        doLogin,
        doLogout,
        logged: !!localStorage.getItem("@Auth:token"),
        user, loginError
    }}>{children}</AuthContext.Provider>;
};

export default AuthProvider