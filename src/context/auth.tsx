import React, { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IUser } from "../interfaces/user";

import api from "../services/api";

export interface DefaultAuthValue {
    doLogin: (email: string, password: string) => void;
    doLogout: () => void;
    logged: boolean;
    user: IUser | null;
    loginError: string;
}

export const AuthContext = createContext<DefaultAuthValue | null>(null);

const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loginError, setLoginError] = useState<string>("");

    useEffect(() => {
        // Verifica se o usuário está logado (se há token), caso afirmativo recupera seus dados na rota /me
        // Se der qualquer erro, o state user fica vazio, e o logged fica falso, rotas protegidas não podem ser acessadas
        const loadingStorageData = async () => {
            const storageAcessToken = localStorage.getItem("@Auth:token");
            if (storageAcessToken) {
                const { data } = await api.get<IUser>("/users/me");

                // Seta usar com os dados passados
                setUser(data);
            }
        };

        loadingStorageData();
    }, []);

    const doLogin = async (email: string, password: string) => {
        try {
            const { data } = await api.post<{
                access_token: string;
                refresh_token: string;
                user: IUser;
            }>("/users/login", {
                email,
                password,
            });

            // Seta o header
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.access_token}`;

            setUser(data.user);
            localStorage.setItem("@Auth:token", data.access_token);
            localStorage.setItem("@Auth:refresh_token", data.refresh_token);
        } catch (err: any) {
            setLoginError(err.response.data.message);
        }
    };

    const doLogout = () => {
        localStorage.clear();
        setUser(null);
        return <Navigate to="/" />;
    };

    return (
        <AuthContext.Provider
            value={{
                doLogin,
                doLogout,
                logged: !!user,
                user,
                loginError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
